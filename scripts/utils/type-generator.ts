import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { compile } from "json-schema-to-typescript";

export interface TypeGeneratorOptions {
  inputPath: string;
  outputPath: string;
  typeName: string;
  isArray?: boolean;
}

/**
 * Infers a JSON Schema from JSON data
 */
export function inferJsonSchema(
  data: unknown,
  typeName: string,
  options: { depth?: number } = {},
): JSONSchema7 {
  const { depth = 0 } = options;
  const maxDepth = 10;

  if (depth > maxDepth) {
    return { type: "object" };
  }

  if (data === null) {
    return { type: "null" };
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return {
        type: "array",
        items: {},
      };
    }

    const itemSchemas = data.map((item) =>
      inferJsonSchema(item, typeName, { depth: depth + 1 }),
    );

    const mergedSchema = mergeSchemas(itemSchemas);

    return {
      type: "array",
      items: mergedSchema,
    };
  }

  if (typeof data === "object") {
    const schema: JSONSchema7 = {
      type: "object",
      properties: {},
      required: [],
    };

    const keys = Object.keys(data);

    for (const key of keys) {
      const value = (data as Record<string, unknown>)[key];

      if (value === undefined) {
        continue;
      }

      const propertySchema = inferJsonSchema(value, key, {
        depth: depth + 1,
      });

      if (schema.properties) {
        schema.properties[key] = propertySchema;
      }

      if (value !== null && value !== undefined) {
        schema.required?.push(key);
      }
    }

    return schema;
  }

  const primitiveType = typeof data;

  if (primitiveType === "string") {
    return { type: "string" };
  }

  if (primitiveType === "number") {
    return { type: "number" };
  }

  if (primitiveType === "boolean") {
    return { type: "boolean" };
  }

  return {};
}

/**
 * Merges multiple schemas into one, handling optional fields and unions
 */
function mergeSchemas(schemas: JSONSchema7[]): JSONSchema7 {
  if (schemas.length === 0) {
    return {};
  }

  if (schemas.length === 1) {
    return schemas[0];
  }

  const types = new Set<string>();
  const allProperties = new Map<string, JSONSchema7Definition[]>();
  const requiredFields = new Map<string, number>();

  for (const schema of schemas) {
    if (schema.type) {
      if (Array.isArray(schema.type)) {
        for (const t of schema.type) {
          types.add(t);
        }
      } else {
        types.add(schema.type);
      }
    }

    if (schema.properties) {
      for (const [key, value] of Object.entries(schema.properties)) {
        if (!allProperties.has(key)) {
          allProperties.set(key, []);
        }
        allProperties.get(key)?.push(value);
      }
    }

    if (schema.required) {
      for (const field of schema.required) {
        requiredFields.set(field, (requiredFields.get(field) || 0) + 1);
      }
    }
  }

  if (types.size === 1 && types.has("object")) {
    const mergedProperties: Record<string, JSONSchema7Definition> = {};
    const required: string[] = [];

    for (const [key, propSchemas] of allProperties.entries()) {
      if (propSchemas.length === 1) {
        mergedProperties[key] = propSchemas[0];
      } else {
        const mergedPropSchema = mergeSchemas(
          propSchemas.filter(
            (s): s is JSONSchema7 => typeof s === "object" && !Array.isArray(s),
          ),
        );
        mergedProperties[key] = mergedPropSchema;
      }

      const fieldCount = requiredFields.get(key) || 0;
      if (fieldCount === schemas.length) {
        required.push(key);
      }
    }

    return {
      type: "object",
      properties: mergedProperties,
      required: required.length > 0 ? required : undefined,
    };
  }

  if (types.has("null") && types.size === 2) {
    const otherType = Array.from(types).find((t) => t !== "null");
    if (otherType) {
      return {
        type: [otherType, "null"],
      } as JSONSchema7;
    }
  }

  if (types.size === 1) {
    return { type: Array.from(types)[0] } as JSONSchema7;
  }

  return {
    type: Array.from(types),
  } as JSONSchema7;
}

/**
 * Enhances schema with string literal types for enum-like fields
 */
function enhanceSchemaWithEnums(
  schema: JSONSchema7,
  data: unknown,
): JSONSchema7 {
  if (!schema.properties) {
    return schema;
  }

  const enhancedProperties: Record<string, JSONSchema7Definition> = {};

  for (const [key, propSchema] of Object.entries(schema.properties)) {
    if (
      typeof propSchema === "object" &&
      !Array.isArray(propSchema) &&
      propSchema.type === "string"
    ) {
      const values = extractFieldValues(data, key);

      if (values.size > 0 && values.size <= 10) {
        enhancedProperties[key] = {
          type: "string",
          enum: Array.from(values),
        };
      } else {
        enhancedProperties[key] = propSchema;
      }
    } else {
      enhancedProperties[key] = propSchema;
    }
  }

  return {
    ...schema,
    properties: enhancedProperties,
  };
}

/**
 * Checks if data contains a links property with LinkMeta-like objects
 */
function hasLinksProperty(data: unknown): boolean {
  function traverse(obj: unknown): boolean {
    if (Array.isArray(obj)) {
      return obj.some((item) => traverse(item));
    }
    if (typeof obj === "object" && obj !== null) {
      const record = obj as Record<string, unknown>;

      if ("links" in record && Array.isArray(record.links)) {
        return true;
      }

      return Object.values(record).some((value) => traverse(value));
    }
    return false;
  }

  return traverse(data);
}

/**
 * Extracts all values for a specific field from data
 */
function extractFieldValues(data: unknown, fieldName: string): Set<string> {
  const values = new Set<string>();

  function traverse(obj: unknown): void {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        traverse(item);
      }
    } else if (typeof obj === "object" && obj !== null) {
      const record = obj as Record<string, unknown>;

      if (fieldName in record) {
        const value = record[fieldName];
        if (typeof value === "string") {
          values.add(value);
        }
      }

      for (const value of Object.values(record)) {
        traverse(value);
      }
    }
  }

  traverse(data);
  return values;
}

/**
 * Generates TypeScript type definition from JSON file
 */
export async function generateTypeDefinition(
  options: TypeGeneratorOptions,
): Promise<void> {
  const { inputPath, outputPath, typeName, isArray = false } = options;

  const jsonContent = await readFile(inputPath, "utf-8");
  const data = JSON.parse(jsonContent);

  let schema = inferJsonSchema(data, typeName);

  if (isArray && Array.isArray(data) && data.length > 0) {
    schema = enhanceSchemaWithEnums(schema.items as JSONSchema7, data);
  } else if (!isArray && typeof data === "object" && data !== null) {
    schema = enhanceSchemaWithEnums(schema, data);
  }

  schema.title = typeName;
  schema.$schema = "http://json-schema.org/draft-07/schema#";

  let typeDefinition = await compile(schema as unknown, typeName, {
    style: {
      semi: true,
      singleQuote: false,
    },
    additionalProperties: false,
  });

  const needsLinkMeta = hasLinksProperty(data);

  if (needsLinkMeta) {
    // Replace both unknown[] and inline LinkMeta-like object arrays with LinkMeta[]
    typeDefinition = typeDefinition.replace(
      /links\??: unknown\[\];/g,
      "links: LinkMeta[];",
    );

    // Replace inline LinkMeta structure with LinkMeta[] reference
    // This pattern matches multi-line object type definitions for links
    typeDefinition = typeDefinition.replace(
      /links\??:\s*\{[^}]*title:\s*string;[^}]*description:\s*string;[^}]*image:\s*string;[^}]*name:\s*string;[^}]*favicon:\s*string;[^}]*url:\s*string;[^}]*\}\[\];/gs,
      "links: LinkMeta[];",
    );

    const importStatement = 'import type { LinkMeta } from "./common.js";\n\n';
    const bannerEnd = typeDefinition.indexOf("*/") + 2;
    typeDefinition =
      typeDefinition.slice(0, bannerEnd + 1) +
      importStatement +
      typeDefinition.slice(bannerEnd + 1);
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, typeDefinition, "utf-8");

  console.log(`✅ Generated ${outputPath}`);
}

/**
 * Extracts common types that appear across multiple schemas
 */
export async function extractCommonTypes(generatedPath: string): Promise<void> {
  const commonTypes = `
/**
 * Metadata for a web link
 */
export interface LinkMeta {
  /**
   * Page title
   */
  title: string;
  /**
   * Page description
   */
  description: string;
  /**
   * Page image (WebP format, base64 encoded path)
   */
  image: string;
  /**
   * Site or platform name
   */
  name: string;
  /**
   * Page URL
   */
  url: string;
  /**
   * Favicon URL
   */
  favicon: string;
}
`;

  const commonPath = join(generatedPath, "common.d.ts");
  await writeFile(commonPath, commonTypes, "utf-8");
  console.log(`✅ Generated ${commonPath}`);
}

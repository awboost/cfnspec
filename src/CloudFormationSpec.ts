import {
  boolean,
  choose,
  Decoder,
  enumValue,
  object,
  optional,
  record,
  string,
  text,
} from '@fmtk/decoders';

type ValueOf<T> = T[keyof T];

export const SpecialType = {
  List: 'List',
  Map: 'Map',
} as const;
export type SpecialType = ValueOf<typeof SpecialType>;

export const PrimitiveType = {
  String: 'String',
  Long: 'Long',
  Integer: 'Integer',
  Double: 'Double',
  Boolean: 'Boolean',
  Timestamp: 'Timestamp',
  Json: 'Json',
};
export type PrimitiveType = ValueOf<typeof PrimitiveType>;

export const UpdateType = {
  Mutable: 'Mutable',
  Immutable: 'Immutable',
  Conditional: 'Conditional',
} as const;
export type UpdateType = ValueOf<typeof UpdateType>;

export interface NonPrimitiveTypeAlias {
  Type: string;
}

export interface PrimitiveTypeAlias {
  PrimitiveType: PrimitiveType;
}

export interface PrimitiveSpecialTypeAlias {
  DuplicatesAllowed?: boolean;
  Type: SpecialType;
  PrimitiveItemType: PrimitiveType;
}

export interface NonPrimitiveSpecialTypeAlias {
  DuplicatesAllowed?: boolean;
  Type: SpecialType;
  ItemType: string;
}

export type TypeAlias =
  | NonPrimitiveSpecialTypeAlias
  | NonPrimitiveTypeAlias
  | PrimitiveSpecialTypeAlias
  | PrimitiveTypeAlias;

export interface TypeMetaInfo {
  Documentation?: string;
  Required?: boolean;
  UpdateType?: UpdateType;
}

export type SubPropertyType = TypeAlias & TypeMetaInfo;

export interface ObjectTypeDef extends TypeMetaInfo {
  Properties: Record<string, SubPropertyType>;
}

export type TypeDef = SubPropertyType | ObjectTypeDef;

export interface ResourceType {
  AdditionalProperties?: boolean;
  Attributes?: Record<string, TypeAlias>;
  Documentation?: string;
  Properties: Record<string, PropertyType>;
}

export type PropertyType = {
  Documentation?: string;
  Required?: boolean;
  UpdateType?: UpdateType;
} & (TypeAlias | ObjectTypeDef);

export interface CloudFormationSpec {
  PropertyTypes: Record<string, PropertyType>;
  ResourceSpecificationVersion: string;
  ResourceTypes: Record<string, ResourceType>;
}

export const decodePrimitiveType = enumValue(PrimitiveType);
export const decodeSpecialType = enumValue(SpecialType);
export const decodeUpdateType = enumValue(UpdateType);

export const decodeSubPropertyType: Decoder<SubPropertyType> = choose(
  object({
    Documentation: optional(string),
    Required: optional(boolean),
    Type: string,
    UpdateType: optional(decodeUpdateType),
  }),
  object({
    Documentation: optional(string),
    DuplicatesAllowed: optional(boolean),
    ItemType: string,
    Required: optional(boolean),
    Type: decodeSpecialType,
    UpdateType: optional(decodeUpdateType),
  }),
  object({
    Documentation: optional(string),
    DuplicatesAllowed: optional(boolean),
    PrimitiveItemType: string,
    Required: optional(boolean),
    Type: decodeSpecialType,
    UpdateType: optional(decodeUpdateType),
  }),
  object({
    Documentation: optional(string),
    PrimitiveType: string,
    Required: optional(boolean),
    UpdateType: optional(decodeUpdateType),
  }),
);

export const decodePrimitiveTypeAlias = object<PrimitiveTypeAlias>({
  PrimitiveType: decodePrimitiveType,
});

export const decodePrimitiveSpecialTypeAlias =
  object<PrimitiveSpecialTypeAlias>({
    DuplicatesAllowed: optional(boolean),
    PrimitiveItemType: decodePrimitiveType,
    Type: decodeSpecialType,
  });

export const decodeNonPrimitiveSpecialTypeAlias =
  object<NonPrimitiveSpecialTypeAlias>({
    DuplicatesAllowed: optional(boolean),
    ItemType: string,
    Type: decodeSpecialType,
  });

export const decodeTypeAlias: Decoder<TypeAlias> = choose(
  decodePrimitiveTypeAlias,
  decodeNonPrimitiveSpecialTypeAlias,
  decodePrimitiveSpecialTypeAlias,
  decodePrimitiveTypeAlias,
);

export const decodeObjectTypeDef: Decoder<ObjectTypeDef> = object({
  Documentation: optional(string),
  Properties: record(string, decodeSubPropertyType),
  Required: optional(boolean),
  UpdateType: optional(decodeUpdateType),
});

export const decodePropertyType = choose(
  decodeObjectTypeDef,
  decodeSubPropertyType,
);

export const decodeResourceType = object<ResourceType>({
  AdditionalProperties: optional(boolean),
  Attributes: optional(record(text, decodeSubPropertyType)),
  Documentation: optional(string),
  Properties: record(string, decodeSubPropertyType),
});

export const decodeCloudFormationSpec = object<CloudFormationSpec>({
  PropertyTypes: record(text, decodePropertyType),
  ResourceSpecificationVersion: string,
  ResourceTypes: record(text, decodeResourceType),
});

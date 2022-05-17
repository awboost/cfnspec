# @awboost/cfnspec

This package retrieves and validates the AWS CloudFormation Resource Specification, and provides TypeScript types for the specification.

## About the specification

From the [official docs][docs]:

> The AWS CloudFormation resource specification is a JSON-formatted text file that defines the resources and properties that AWS CloudFormation supports. The document is a machine-readable, strongly typed specification that you can use to build tools for creating AWS CloudFormation templates. For example, you can use the specification to build auto completion and validation functionality for AWS CloudFormation templates in your IDE (integrated development environment).

## Specification format

See AWS CloudFormation [Specification Format](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification-format.html).

## API

### DefaultSpecUrl

The location of the specification for `us-east-1` (N. Virginia) region.

```typescript
export const DefaultSpecUrl: string;
```

### getLatestSpec()

Get the latest specification from the specified URL (or `us-east-1` if not specified). For other regions, see the [docs][docs]. This will validate the specification by default unless `false` is passed as the second parameter.

```typescript
function getLatestSpec(
  url = DefaultSpecUrl,
  validate = true,
): Promise<CloudFormationSpec>;
```

## Interfaces

```typescript
export interface CloudFormationSpec {
  PropertyTypes: Dictionary<TypeDefinition>;
  ResourceSpecificationVersion: string;
  ResourceTypes: Dictionary<ResourceDefinition>;
}

export interface TypeDefinition {
  AdditionalProperties?: boolean;
  Documentation?: string;
  DuplicatesAllowed?: boolean;
  ItemType?: string;
  PrimitiveItemType?: PrimitiveType;
  PrimitiveType?: PrimitiveType;
  Properties?: Dictionary<TypeDefinition>;
  Required?: boolean;
  Type?: string;
  UpdateType?: UpdateType;
}

export interface ResourceDefinition extends TypeDefinition {
  Attributes?: Dictionary<TypeDefinition>;
}

export interface Dictionary<T> {
  [key: string]: T;
}

export enum PrimitiveType {
  String = 'String',
  Long = 'Long',
  Integer = 'Integer',
  Double = 'Double',
  Boolean = 'Boolean',
  Timestamp = 'Timestamp',
  Json = 'Json',
}

export enum UpdateType {
  Mutable = 'Mutable',
  Immutable = 'Immutable',
  Conditional = 'Conditional',
}
```

[docs]: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html

import type {
  AudienceRecordDocument,
  AudienceSegmentDocument,
  AuditEventDocument,
  DistrictDocument,
  PrivilegeGroupDocument,
  SegmentDefinitionDocument,
  SourceDocument,
  UserDocument,
} from "./types.js";
import type {
  AudienceRecordRepository,
  AudienceSegmentRepository,
  AuditEventRepository,
  DistrictRepository,
  PrivilegeGroupRepository,
  SegmentDefinitionRepository,
  SourceRepository,
  UserRepository,
} from "./repositories.js";

function cloneDocument<T>(value: T): T {
  return structuredClone(value);
}

class InMemoryDocumentStore<T extends Record<string, unknown>> {
  private readonly documents = new Map<string, T>();

  constructor(private readonly idSelector: (document: T) => string) {}

  async list(): Promise<T[]> {
    return Array.from(this.documents.values(), cloneDocument);
  }

  async getById(id: string): Promise<T | undefined> {
    const document = this.documents.get(id);
    return document ? cloneDocument(document) : undefined;
  }

  async save(document: T): Promise<void> {
    this.documents.set(this.idSelector(document), cloneDocument(document));
  }
}

export class InMemoryDistrictRepository implements DistrictRepository {
  private readonly store = new InMemoryDocumentStore<DistrictDocument>(
    (district) => district.districtId,
  );

  getById(districtId: string): Promise<DistrictDocument | undefined> {
    return this.store.getById(districtId);
  }

  list(): Promise<DistrictDocument[]> {
    return this.store.list();
  }

  save(district: DistrictDocument): Promise<void> {
    return this.store.save(district);
  }
}

export class InMemorySourceRepository implements SourceRepository {
  private readonly store = new InMemoryDocumentStore<SourceDocument>(
    (source) => source.sourceId,
  );

  async findByDistrictId(districtId: string): Promise<SourceDocument[]> {
    const sources = await this.store.list();
    return sources.filter((source) => source.districtIds.includes(districtId));
  }

  getById(sourceId: string): Promise<SourceDocument | undefined> {
    return this.store.getById(sourceId);
  }

  list(): Promise<SourceDocument[]> {
    return this.store.list();
  }

  save(source: SourceDocument): Promise<void> {
    return this.store.save(source);
  }
}

export class InMemorySegmentDefinitionRepository
  implements SegmentDefinitionRepository
{
  private readonly store = new InMemoryDocumentStore<SegmentDefinitionDocument>(
    (definition) => definition.segmentDefinitionId,
  );

  async getByDimensionKey(
    dimensionKey: string,
  ): Promise<SegmentDefinitionDocument | undefined> {
    const definitions = await this.store.list();
    return definitions.find((definition) => definition.dimensionKey === dimensionKey);
  }

  getById(
    segmentDefinitionId: string,
  ): Promise<SegmentDefinitionDocument | undefined> {
    return this.store.getById(segmentDefinitionId);
  }

  list(): Promise<SegmentDefinitionDocument[]> {
    return this.store.list();
  }

  save(document: SegmentDefinitionDocument): Promise<void> {
    return this.store.save(document);
  }
}

export class InMemoryAudienceSegmentRepository
  implements AudienceSegmentRepository
{
  private readonly store = new InMemoryDocumentStore<AudienceSegmentDocument>(
    (segment) => segment.segmentId,
  );

  async findByDimensionKey(dimensionKey: string): Promise<AudienceSegmentDocument[]> {
    const segments = await this.store.list();
    return segments.filter((segment) =>
      segment.filters.criteria.some((criterion) => criterion.dimensionKey === dimensionKey),
    );
  }

  getById(segmentId: string): Promise<AudienceSegmentDocument | undefined> {
    return this.store.getById(segmentId);
  }

  list(): Promise<AudienceSegmentDocument[]> {
    return this.store.list();
  }

  save(document: AudienceSegmentDocument): Promise<void> {
    return this.store.save(document);
  }
}

export class InMemoryAudienceRecordRepository
  implements AudienceRecordRepository
{
  private readonly store = new InMemoryDocumentStore<AudienceRecordDocument>(
    (record) => record.audienceRecordId,
  );

  getById(audienceRecordId: string): Promise<AudienceRecordDocument | undefined> {
    return this.store.getById(audienceRecordId);
  }

  list(): Promise<AudienceRecordDocument[]> {
    return this.store.list();
  }

  save(document: AudienceRecordDocument): Promise<void> {
    return this.store.save(document);
  }
}

export class InMemoryUserRepository implements UserRepository {
  private readonly store = new InMemoryDocumentStore<UserDocument>(
    (user) => user.userId,
  );

  async findByEmail(email: string): Promise<UserDocument | undefined> {
    const users = await this.store.list();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  getById(userId: string): Promise<UserDocument | undefined> {
    return this.store.getById(userId);
  }

  list(): Promise<UserDocument[]> {
    return this.store.list();
  }

  save(user: UserDocument): Promise<void> {
    return this.store.save(user);
  }
}

export class InMemoryPrivilegeGroupRepository
  implements PrivilegeGroupRepository
{
  private readonly store = new InMemoryDocumentStore<PrivilegeGroupDocument>(
    (group) => group.privilegeGroupId,
  );

  getById(
    privilegeGroupId: string,
  ): Promise<PrivilegeGroupDocument | undefined> {
    return this.store.getById(privilegeGroupId);
  }

  list(): Promise<PrivilegeGroupDocument[]> {
    return this.store.list();
  }

  save(group: PrivilegeGroupDocument): Promise<void> {
    return this.store.save(group);
  }
}

export class InMemoryAuditEventRepository implements AuditEventRepository {
  private readonly store = new InMemoryDocumentStore<AuditEventDocument>(
    (event) => event.auditEventId,
  );

  list(): Promise<AuditEventDocument[]> {
    return this.store.list();
  }

  save(event: AuditEventDocument): Promise<void> {
    return this.store.save(event);
  }
}

import { MongoClient } from 'mongodb';

const globalForPrisma = globalThis;
const uri = process.env.DATABASE_URL;

let mongoClient = globalForPrisma.mongoClient ?? null;
let mongoDb = globalForPrisma.mongoDb ?? null;
let prismaConnected = false;

function getCollectionName(modelName) {
  const mapping = {
    user: 'users',
    profile: 'profiles',
    verificationToken: 'verification_tokens',
  };

  return mapping[modelName] || modelName;
}

function toObjectId(value) {
  if (!value) return null;
  if (typeof value === 'string' && value.match(/^[0-9a-fA-F]{24}$/)) {
    return value;
  }
  return value;
}

async function getDb() {
  if (!uri) {
    throw new Error('DATABASE_URL is not configured');
  }

  if (!mongoClient) {
    mongoClient = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  if (!prismaConnected) {
    await mongoClient.connect();
    prismaConnected = true;

    const dbName = uri.split('/').pop()?.split('?')[0] || 'ridewave';
    mongoDb = mongoClient.db(dbName);
    console.log('[prisma] Connected to MongoDB successfully');
  }

  return mongoDb;
}

const createHelpers = () => {
  const collection = async (modelName) => {
    const db = await getDb();
    return db.collection(getCollectionName(modelName));
  };

  return {
    user: {
      async findUnique({ where = {}, select, include }) {
        const users = await collection('user');
        const query = {};

        if (where.email) query.email = where.email;
        if (where.id) query._id = toObjectId(where.id);
        if (where.referralCode) query.referralCode = where.referralCode;

        const doc = await users.findOne(query);
        if (!doc) return null;

        const user = {
          ...doc,
          id: doc._id?.toString?.() || doc.id,
        };

        if (select) {
          const selected = {};
          Object.keys(select).forEach((key) => {
            if (key === 'id') {
              selected.id = user.id;
            } else if (key in user) {
              selected[key] = user[key];
            }
          });
          return selected;
        }

        if (include?.profile) {
          const profiles = await collection('profile');
          const profile = await profiles.findOne({ userId: user.id });
          return { ...user, profile };
        }

        return user;
      },
      async findFirst({ where = {} }) {
        const users = await collection('user');
        const query = {};
        if (where.email) query.email = where.email;
        if (where.id) query._id = toObjectId(where.id);
        if (where.referralCode) query.referralCode = where.referralCode;
        const doc = await users.findOne(query);
        if (!doc) return null;
        return { ...doc, id: doc._id?.toString?.() || doc.id };
      },
      async create({ data }) {
        const users = await collection('user');
        const now = new Date();
        const doc = {
          ...data,
          createdAt: now,
          updatedAt: now,
        };

        const result = await users.insertOne(doc);
        const created = await users.findOne({ _id: result.insertedId });
        return { ...created, id: created._id?.toString?.() || created.id };
      },
      async update({ where = {}, data }) {
        const users = await collection('user');
        const query = where.id ? { _id: toObjectId(where.id) } : {};
        const update = {
          $set: {
            ...data,
            updatedAt: new Date(),
          },
        };
        await users.updateOne(query, update);
        const updated = await users.findOne(query);
        return updated ? { ...updated, id: updated._id?.toString?.() || updated.id } : null;
      },
    },
    profile: {
      async create({ data }) {
        const profiles = await collection('profile');
        const now = new Date();
        const doc = { ...data, createdAt: now, updatedAt: now };
        const result = await profiles.insertOne(doc);
        const created = await profiles.findOne({ _id: result.insertedId });
        return { ...created, id: created._id?.toString?.() || created.id };
      },
    },
    verificationToken: {
      async create({ data }) {
        const tokens = await collection('verificationToken');
        const result = await tokens.insertOne(data);
        const created = await tokens.findOne({ _id: result.insertedId });
        return { ...created, id: created._id?.toString?.() || created.id };
      },
      async findFirst({ where = {} }) {
        const tokens = await collection('verificationToken');
        const query = {};
        if (where.token) query.token = where.token;
        if (where.identifier) query.identifier = where.identifier;
        if (where.expires) query.expires = where.expires;
        const doc = await tokens.findOne(query);
        return doc ? { ...doc, id: doc._id?.toString?.() || doc.id } : null;
      },
      async deleteMany({ where = {} }) {
        const tokens = await collection('verificationToken');
        const query = {};
        if (where.identifier) query.identifier = where.identifier;
        await tokens.deleteMany(query);
      },
      async delete({ where = {} }) {
        const tokens = await collection('verificationToken');
        const query = where.id ? { _id: toObjectId(where.id) } : {};
        await tokens.deleteOne(query);
      },
    },
    async $connect() {
      await getDb();
    },
    async $disconnect() {
      if (mongoClient) {
        await mongoClient.close();
        mongoClient = null;
        mongoDb = null;
        prismaConnected = false;
      }
    },
  };
};

export const prisma = createHelpers();

export async function connectPrisma() {
  await getDb();
  return prisma;
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

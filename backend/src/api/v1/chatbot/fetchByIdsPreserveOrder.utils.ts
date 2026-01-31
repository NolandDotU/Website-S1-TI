import mongoose from "mongoose";

export async function fetchByIdsPreserveOrder<T extends { _id: any }>(
    model: any,
    ids: string[],
): Promise<T[]> {
    if (ids.length === 0) return [];
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    const docs = await model.find({ _id: { $in: objectIds } });
    const map = new Map<string, T>();
    
    docs.forEach((d: T) => map.set(d._id.toString(), d));

    return ids.map(id => map.get(id)).filter(Boolean) as T[];
}

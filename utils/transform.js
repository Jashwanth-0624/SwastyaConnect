// Transform MongoDB document to include id field from _id
export function transformDocument(doc) {
  if (!doc) return doc;
  
  if (Array.isArray(doc)) {
    return doc.map(item => {
      const obj = item.toObject ? item.toObject() : item;
      if (obj._id && !obj.id) {
        obj.id = obj._id.toString();
      }
      return obj;
    });
  }
  
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id && !obj.id) {
    obj.id = obj._id.toString();
  }
  return obj;
}


import { InMemoryCache } from "@apollo/client";


// function to merge the incoming list items withthe existing list items without duplicates
// used by the InMemorytCache
function listMergeNoDuplicates(existing = [], incoming: any) {
  console.debug('[listMergeNoDuplicates] existing', existing);
  return existing.concat(incoming.filter((x: any) => existing.every((y: any) => y.skuKey !== x.skuKey)));
}

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        countries: {
          merge: listMergeNoDuplicates,
        }
      }
    },
    SkuList: {
      fields: {
        skus: {
          merge: listMergeNoDuplicates,
        },
      }
    },
    RetailerList: {
      fields: {
        retailers: {
          merge: listMergeNoDuplicates,
        },
      }
    }
  }
});
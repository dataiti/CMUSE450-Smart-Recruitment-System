const parseArrayQueryParam = (paramName, query) =>
  query[paramName] && query[paramName] !== "[]"
    ? JSON.parse(query[paramName])
    : -1;

const calculateSimilarity = (userA, userB) => {
  const viewedJobsA = userA.viewedJobs?.map((job) => job.toString());
  const appliedJobsA = userA.appliedJobs?.map((job) => job.toString());
  const wishlistJobsA = userA.wishlistIds?.map((job) => job.toString());
  const viewedJobsB = userB.viewedJobs?.map((job) => job.toString());
  const appliedJobsB = userB.appliedJobs?.map((job) => job.toString());
  const wishlistJobsB = userB.wishlistIds?.map((job) => job.toString());

  const intersectionViewed = viewedJobsA.filter((job) =>
    viewedJobsB.includes(job)
  );
  const intersectionApplied = appliedJobsA.filter((job) =>
    appliedJobsB.includes(job)
  );
  const intersectionWishlist = wishlistJobsA.filter((job) =>
    wishlistJobsB.includes(job)
  );

  const magnitudeA = Math.sqrt(
    viewedJobsA.length + appliedJobsA.length + wishlistJobsA.length
  );
  const magnitudeB = Math.sqrt(
    viewedJobsB.length + appliedJobsB.length + wishlistJobsB.length
  );

  const cosineSimilarityViewed =
    magnitudeA !== 0 && magnitudeB !== 0
      ? intersectionViewed.length / (magnitudeA * magnitudeB)
      : 0;

  const cosineSimilarityApplied =
    magnitudeA !== 0 && magnitudeB !== 0
      ? intersectionApplied.length / (magnitudeA * magnitudeB)
      : 0;

  const cosineSimilarityWishlist =
    magnitudeA !== 0 && magnitudeB !== 0
      ? intersectionWishlist.length / (magnitudeA * magnitudeB)
      : 0;

  const weightedAverage =
    0.5 * cosineSimilarityViewed +
    0.3 * cosineSimilarityWishlist +
    0.2 * cosineSimilarityApplied;

  return weightedAverage;
};

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = { parseArrayQueryParam, calculateSimilarity, sortObject };

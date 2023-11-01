exports.convertTimestampToDate = ({ date, ...otherProperties }) => {
    if (!date) return { ...otherProperties };
    return { date: new Date(date), ...otherProperties };
  };
  
  exports.createRef = (arr, key, value) => {
    return arr.reduce((ref, element) => {
      ref[element[key]] = element[value];
      return ref;
    }, {});
  };
  
  exports.formatComments = (comments, idLookup) => {
    return comments.map(({ created_by, belongs_to, ...restOfReview }) => {
      const article_id = idLookup[belongs_to];
      return {
        article_id,
        author: created_by,
        ...this.convertTimestampToDate(restOfReview),
      };
    });
  };
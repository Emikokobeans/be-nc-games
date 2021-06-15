// extract any functions you are using to manipulate your data, into this file

exports.formatCategoryData = (categoryData) => {
  const categoryValues = categoryData.map((category) => {
    return [category.slug, category.description];
  });
  return categoryValues;
};

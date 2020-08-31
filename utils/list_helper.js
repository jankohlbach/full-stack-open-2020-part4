const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0);

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return null;

  return blogs.reduce((prev, curr) => prev.likes > curr.likes
    ? {
      title: prev.title,
      author: prev.author,
      likes: prev.likes,
    }
    : {
      title: curr.title,
      author: curr.author,
      likes: curr.likes,
    }
  , {});
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};

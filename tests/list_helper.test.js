const listHelper = require('./../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ];

  const listWithMoreBlogs = [
    {
      _id: '5f4cc996c00c4d2108c780da',
      title: 'Titel 1',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 101,
      __v: 0
    },
    {
      _id: '5f4cf80dc100a40f80d494fb',
      title: 'Titel 3',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 101,
      __v: 0
    }
  ];

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    expect(result).toBe(5);
  });

  test('when list has no blogs, return 0', () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test('when list has more blogs, return the sum', () => {
    const result = listHelper.totalLikes(listWithMoreBlogs);
    expect(result).toBe(202);
  });
});

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ];

  const listWithMoreBlogs = [
    {
      _id: '5f4cc996c00c4d2108c780da',
      title: 'Titel 1',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 101,
      __v: 0
    },
    {
      _id: '5f4cf80dc100a40f80d494fb',
      title: 'Titel 3',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 120,
      __v: 0
    },
    {
      _id: '5f4cf80dc100a30f80d494fb',
      title: 'Titel 2',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 101,
      __v: 0
    }
  ];

  const listWithMoreBlogsSameLikes = [
    {
      _id: '5f4cc996c00c4d2108c780da',
      title: 'Titel 1',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 101,
      __v: 0
    },
    {
      _id: '5f4cf80dc100a40f80d494fb',
      title: 'Titel 3',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 120,
      __v: 0
    },
    {
      _id: '5f4cf80dc100a30f80d494fb',
      title: 'Titel 2',
      author: 'Me',
      url: 'https://jankohlbach.com',
      likes: 120,
      __v: 0
    }
  ];

  test('when list has only one blog, entry is the most favorite', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    expect(result).toEqual({
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('when list has no blogs, return null', () => {
    const result = listHelper.favoriteBlog([]);
    expect(result).toBe(null);
  });

  test('when list has more blogs, return most favorite', () => {
    const result = listHelper.favoriteBlog(listWithMoreBlogs);
    expect(result).toEqual({
      title: 'Titel 3',
      author: 'Me',
      likes: 120,
    });
  });

  test('when list has more blogs with same like count, return last one', () => {
    const result = listHelper.favoriteBlog(listWithMoreBlogsSameLikes);
    expect(result).toEqual({
      title: 'Titel 2',
      author: 'Me',
      likes: 120,
    });
  });
});

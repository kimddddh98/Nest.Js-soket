import { Injectable, NotFoundException } from '@nestjs/common'

export interface PostModel {
  id: number
  author: string
  title: string
  content: string
  likeCount: number
  commentCount: number
}

let posts: PostModel[] = [
  {
    id: 1,
    author: 'official',
    title: '제목',
    content: '컨텐츠',
    likeCount: 0,
    commentCount: 0
  },
  {
    id: 2,
    author: 'official',
    title: '2번째',
    content: '오피셜 2번째',
    likeCount: 9999,
    commentCount: 9999
  },
  {
    id: 3,
    author: 'official',
    title: '3번째',
    content: '오피셜 3번째',
    likeCount: 9999,
    commentCount: 9999
  }
]
@Injectable()
export class PostsService {
  getAllPosts() {
    return posts
  }
  getPostById(id: number) {
    const post = posts.find(post => post.id === +id)
    if (!post) {
      throw new NotFoundException()
    }
    return post
  }

  createPost(author: string, title: string, content: string) {
    const post: PostModel = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0
    }
    posts = [...posts, post]
    return post
  }

  updatePost(id: number, author?: string, title?: string, content?: string) {
    const post = posts.find(post => post.id === id)
    if (!post) {
      throw new NotFoundException()
    }
    if (author) {
      post.author = author
    }
    if (title) {
      post.title = title
    }
    if (post.content) {
      post.content = content
    }
    posts = posts.map(prePost => (prePost.id === id ? post : prePost))
    return post
  }

  deletePost(id: number) {
    const post = posts.find(post => post.id === id)
    if (!post) {
      throw new NotFoundException()
    }
    posts = posts.filter(post => post.id !== id)
    return id
  }
}

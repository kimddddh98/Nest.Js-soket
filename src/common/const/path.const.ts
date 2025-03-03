import { join } from 'path'

export const PROJECT_ROOT_PATH = process.cwd()

export const PUBLIC_FOLDER_NAME = 'public'

export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME)

// 임시 폴더
export const TEMP_FOLDER_NAME = 'temp'

export const TEMP_FOLDER_PATH = join(PUBLIC_FOLDER_PATH, TEMP_FOLDER_NAME)

export const TEMP_FOLDER_RELATIVE_PATH = join(
  PUBLIC_FOLDER_NAME,
  TEMP_FOLDER_NAME
)

// 포스트 폴더
export const POST_UPLOAD_FOLDER_NAME = 'posts'

// 절대경로
// /Users/username/project-root/public/posts

export const POST_UPLOAD_FOLDER_PATH = join(
  PUBLIC_FOLDER_PATH,
  POST_UPLOAD_FOLDER_NAME
)

//상대 경로
// public/posts
export const POST_UPLOAD_FOLDER_RELATIVE_PATH = join(
  PUBLIC_FOLDER_NAME,
  POST_UPLOAD_FOLDER_NAME
)

// 프로필 이미지 폴더

export const PROFILE_UPLOAD_FOLDER_NAME = 'profile'

export const PROFILE_UPLOAD_FOLDER_PATH = join(
  PUBLIC_FOLDER_PATH,
  PROFILE_UPLOAD_FOLDER_NAME
)

export const PROFILE_UPLOAD_FOLDER_RELATIVE_PATH = join(
  PUBLIC_FOLDER_NAME,
  PROFILE_UPLOAD_FOLDER_NAME
)

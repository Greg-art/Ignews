import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'
import { getPrismicClient } from '../../services/prismic'

const post = { 
  slug: 'my-new-post', title: 'My New Post', content: '<p>content</p>', updatedAt: '10 de Abril'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/react')
jest.mock('next/router')

describe('Post Preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({
      data: null,
    } as any)

    render(<Post post={post} /> )

    expect(screen.getByText("My New Post")).toBeInTheDocument()
    expect(screen.getByText("content")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
  })

  it('redirects user to full post when user is subscribed', async () => {
    const pushMock = jest.fn()


    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {activeSubscription: 'fake-subscription'},
    } as any)
    
    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<Post post={post} /> )

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post')

  })



  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My New Post'}
          ],
          content: [
            { type: 'paragraph', text: 'Post Content'}
          ],
        },
        last_publication_date: '04-01-2021'
      })
    } as any)    

    const response = await getStaticProps({ 
      params: { slug: 'my-new-post'} 
    })


    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post:{
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post Content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )    
  })
})
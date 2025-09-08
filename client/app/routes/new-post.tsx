import { useEffect, useState, ChangeEvent } from 'react';
import { ActionFunctionArgs, redirect, useActionData } from 'react-router';
import { Alert, Button, Header, Input, TextEditor } from '../components';
import { Routes, createPost } from '../lib';
import styles from './styles.module.css';
import { generateSlug } from '../utils';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const schedule = formData.get('schedule') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;

  console.log('[New Post] Form data:', Object.fromEntries(formData.entries()));
  console.log('[New Post] Title from form:', title, typeof title);
  console.log('[New Post] Slug from form:', slug, typeof slug);
  console.log('[New Post] Schedule from form:', schedule, typeof schedule);
  console.log('[New Post] Excerpt from form:', excerpt, typeof excerpt);
  console.log('[New Post] Content from form:', content, typeof content);

  try {
    await createPost({
      title,
      slug,
      // TODO: Ensure schedule is in ISO string format
      schedule: schedule ? new Date(schedule).toISOString() : undefined,
      excerpt,
      content,
    });

    if (schedule) {
      return redirect(`${Routes.HOME}`);
    } else {
      return redirect(`${Routes.POSTS_VIEW.replace(':slug', slug)}`);
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to create post: ${error.message}. Please try again later.`
          : 'Failed to create post. Please try again later.',
    };
  }
};

const NewPost = () => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actionData = useActionData() as
    | { success?: boolean; error?: string }
    | undefined;

  useEffect(() => {
    if (actionData) {
      setIsSubmitting(false);
    }
  }, [actionData]);

  const handleTitleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Only auto-generate slug if it's empty or matches the previous auto-generated slug
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(newTitle));
    }
  };

  return (
    <div className={styles.container}>
      {' '}
      {actionData?.error && (
        <Alert
          type={'error'}
          message={actionData.error}
          autoDismiss
          dismissAfter={3000}
        />
      )}
      <Button
        to={Routes.HOME}
        text="←"
        kind="inverted-dark"
        className={styles['back-button']}
      />
      <Header
        title="Write a new post!"
        style={{
          paddingTop: 'var(--spacing-12)',
        }}
      />
      <form method="post" action="" className={styles['post-form']}>
        <div className={styles['post-form-data']}>
          <div className={styles['title-row']}>
            <Input
              label="Title"
              type="text"
              name="title"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange}
              required
            />
            <Input
              label="Slug"
              type="text"
              name="slug"
              placeholder="post-slug"
              value={slug}
              onChange={e => setSlug(e.target.value)}
              required
            />
            <Input
              label="Schedule"
              type="datetime-local"
              name="schedule"
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <Input
            label="Excerpt"
            type="text-area"
            name="excerpt"
            placeholder="Write a short excerpt for the post"
            required
          />
        </div>
        <TextEditor content={content} onChange={setContent} />
        <input type="hidden" name="content" value={content} required />
        <Button
          type="submit"
          text="Publish"
          kind="dark"
          disabled={isSubmitting}
          style={{ width: 'fit-content' }}
        />
      </form>
    </div>
  );
};

export default NewPost;

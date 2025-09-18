import { useState, ChangeEvent, useEffect } from 'react';
import {
  ActionFunctionArgs,
  redirect,
  useActionData,
  useSubmit,
} from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fromZonedTime } from 'date-fns-tz';
import { Alert, Button, Header, Input, TextEditor } from '../components';
import { Routes, createPost } from '../lib';
import { generateSlug } from '../utils';
import {
  createPostSchema,
  validateData,
  type CreatePostInput,
} from '../validation';
import styles from './styles.module.css';
import { getTimezoneCookie } from '../hooks';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { userTz } = getTimezoneCookie(request);

  const formData = await request.formData();
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const schedule = formData.get('schedule') as string;
  const excerpt = formData.get('excerpt') as string;
  const content = formData.get('content') as string;

  const validation = validateData(createPostSchema, {
    title,
    slug,
    schedule,
    excerpt,
    content,
  });

  if (!validation.success) {
    return {
      success: false,
      error: 'Validation failed',
      validationErrors: validation.errors,
    };
  }

  const scheduleUTC = schedule ? fromZonedTime(schedule, userTz) : null;

  try {
    await createPost({
      title,
      slug,
      schedule: scheduleUTC?.toISOString(),
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
  const actionData = useActionData() as
    | {
        success?: boolean;
        error?: string;
        validationErrors?: Array<{ field: string; message: string }>;
      }
    | undefined;

  const submit = useSubmit();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (actionData?.error) {
      setShowAlert(true);
    }
  }, [actionData]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      schedule: '',
      content: '',
    },
  });

  const title = watch('title');
  const slug = watch('slug');

  const handleTitleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newTitle = e.target.value;
    setValue('title', newTitle);
    // Only auto-generate slug if it's empty or matches the previous auto-generated slug
    if (!slug || slug === generateSlug(title)) {
      setValue('slug', generateSlug(newTitle));
    }
  };

  return (
    <div className={styles.container}>
      {showAlert && actionData?.error && (
        <Alert
          type={'error'}
          message={actionData.error}
          autoDismiss
          dismissAfter={5000}
          onDismiss={() => setShowAlert(false)}
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
      <form
        method="post"
        onSubmit={handleSubmit((data: CreatePostInput) =>
          submit(data, { method: 'post' })
        )}
        className={styles['form-new-post']}
      >
        <div className={styles['new-post-form-data']}>
          <div className={styles['title-row']}>
            <div className={styles['input-container']}>
              <Input
                label="Title"
                type="text"
                placeholder="Title"
                {...register('title')}
                onChange={handleTitleChange}
                // required
              />
              {errors.title && (
                <span className={styles['input-error']}>
                  {errors.title.message}
                </span>
              )}
            </div>
            <div className={styles['input-container']}>
              <Input
                label="Slug"
                type="text"
                placeholder="post-slug"
                {...register('slug')}
                // required
              />
              {errors.slug && (
                <span className={styles['input-error']}>
                  {errors.slug.message}
                </span>
              )}
            </div>
            <div className={styles['input-container']}>
              <Input
                label="Schedule"
                type="datetime-local"
                {...register('schedule')}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.schedule && (
                <span className={styles['input-error']}>
                  {errors.schedule.message}
                </span>
              )}
            </div>
          </div>
          <div className={styles['input-container']}>
            <Input
              label="Excerpt"
              type="text-area"
              placeholder="Write a short excerpt for the post"
              {...register('excerpt')}
              // required
            />
            {errors.excerpt && (
              <span className={styles['input-error']}>
                {errors.excerpt.message}
              </span>
            )}
          </div>
        </div>
        <div className={styles['input-container']}>
          <TextEditor
            content={watch('content')}
            onChange={newContent => {
              setValue('content', newContent);
            }}
          />
          <input type="hidden" {...register('content')} />
          {errors.content && (
            <span className={styles['input-error']}>
              {errors.content.message}
            </span>
          )}
        </div>
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

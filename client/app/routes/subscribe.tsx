import { useEffect, useState, useCallback } from 'react';
import { Link, useActionData, useSubmit } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Header, Input, Button, Alert } from '../components';
import { Routes } from '../lib';
import {
  createSubscriberSchema,
  validateData,
  type CreateSubscriberInput,
} from '../validation';
import { createSubscriber } from '../lib';
import styles from './styles.module.css';

type ActionData = {
  success?: boolean;
  error?: string;
  message?: string;
  validationErrors?: Array<{ field: string; message: string }>;
};

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<ActionData> => {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  const validation = validateData(createSubscriberSchema, { email });

  if (!validation.success) {
    return {
      success: false,
      error: 'Validation failed',
      validationErrors: validation.errors,
    };
  }

  try {
    await createSubscriber(email);
    return {
      success: true,
      message: 'Successfully subscribed to our newsletter!',
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? `Failed to create subscriber: ${error.message}. Please try again later.`
          : 'Failed to create subscriber. Please try again later.',
    };
  }
};

const Subscribe = () => {
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  const [showAlert, setShowAlert] = useState(false);

  const handleDismissAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  useEffect(() => {
    if (actionData) {
      setShowAlert(true);
    }
  }, [actionData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubscriberInput>({
    resolver: zodResolver(createSubscriberSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <>
      {showAlert && (
        <Alert
          type={actionData?.success ? 'success' : 'error'}
          message={
            actionData?.success ? actionData?.message : actionData?.error
          }
          autoDismiss
          dismissAfter={3000}
          onDismiss={handleDismissAlert}
        />
      )}
      <img
        className={styles['newsletter-image']}
        src="/images/newsletter.jpg"
        alt="newsletter"
      />
      <Header
        title="Do you wanna know more"
        description="Subscribe to our newsletter!"
      />
      <form
        method="post"
        onSubmit={handleSubmit((data: CreateSubscriberInput) =>
          submit(data, { method: 'post' })
        )}
        className={styles['form-subscribe']}
      >
        <div className={styles['input-container']}>
          <Input
            type="email"
            placeholder="Email"
            {...register('email')}
            style={{
              borderTopRightRadius: '0',
              borderBottomRightRadius: '0',
              borderRight: 'none',
              borderWidth: '2px',
            }}
            // required
          />
          {errors.email && (
            <p className={styles['input-error']}>{errors.email.message}</p>
          )}
        </div>
        <Button
          type="submit"
          text="Subscribe"
          loading={isSubmitting}
          disabled={isSubmitting}
          style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0' }}
        />
      </form>
      <Link style={{ marginTop: 'var(--spacing-6)' }} to={Routes.HOME}>
        Let me read some articles first →
      </Link>
    </>
  );
};

export default Subscribe;

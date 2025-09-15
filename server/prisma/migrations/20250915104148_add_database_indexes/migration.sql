-- CreateIndex
CREATE INDEX "email_deliveries_post_id_subscriber_id_idx" ON "email_deliveries"("post_id", "subscriber_id");

-- CreateIndex
CREATE INDEX "email_deliveries_status_idx" ON "email_deliveries"("status");

-- CreateIndex
CREATE INDEX "email_deliveries_post_id_status_idx" ON "email_deliveries"("post_id", "status");

-- CreateIndex
CREATE INDEX "email_deliveries_subscriber_id_status_idx" ON "email_deliveries"("subscriber_id", "status");

-- CreateIndex
CREATE INDEX "email_deliveries_sent_at_idx" ON "email_deliveries"("sent_at");

-- CreateIndex
CREATE INDEX "posts_status_idx" ON "posts"("status");

-- CreateIndex
CREATE INDEX "posts_published_at_idx" ON "posts"("published_at");

-- CreateIndex
CREATE INDEX "posts_status_published_at_idx" ON "posts"("status", "published_at");

-- CreateIndex
CREATE INDEX "posts_category_idx" ON "posts"("category");

-- CreateIndex
CREATE INDEX "subscribers_subscribed_idx" ON "subscribers"("subscribed");

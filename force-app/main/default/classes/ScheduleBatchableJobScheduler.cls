public class ScheduleBatchableJobScheduler {
    public static void scheduleJob() {
        // CRON expression to run at 12 AM on the first day of every month
        String cronExpression = '0 0 0 1 * ?';
        SchedulableExample scheduledJob = new SchedulableExample();
        // Schedule the job
        System.schedule('Monthly Batchable Job', cronExpression, scheduledJob);
    }
}
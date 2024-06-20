global with sharing class SchedulableExample implements Schedulable {

    global void execute(SchedulableContext sc) {
        // Instantiate the batchable class
        BatchableExample batchable = new BatchableExample();
        // Execute the batchable class
        Database.executeBatch(batchable);
    }
}
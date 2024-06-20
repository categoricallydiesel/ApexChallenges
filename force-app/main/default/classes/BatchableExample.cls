global with sharing class BatchableExample implements Database.Batchable<SObject> {

    global Database.QueryLocator start(Database.BatchableContext bc) {
        // Select accounts that might need to be processed
        return Database.getQueryLocator([
            SELECT Id, Name
            FROM Account
            WHERE Id NOT IN (
                SELECT AccountId 
                FROM Opportunity
                WHERE CloseDate >= LAST_N_MONTHS:6
                AND StageName != 'Closed Won'
                AND StageName != 'Closed Lost'
            )
        ]);
    }

    global void execute(Database.BatchableContext bc, List<SObject> scope) {
        // Type cast the scope parameter to a list of Account
        List<Account> accountList = (List<Account>)scope;

        // Delete the accounts that match query criteria
        if (!accountList.isEmpty()) {
            delete accountList;
        }
    }

    global void finish(Database.BatchableContext bc) {
    }
}

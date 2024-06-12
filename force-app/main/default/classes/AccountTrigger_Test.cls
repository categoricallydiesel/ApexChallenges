/**
 * This class contains unit tests for validating the behavior of Apex classes
 * and triggers.
 *
 * Unit tests are class methods that verify whether a particular piece
 * of code is working properly. Unit test methods take no arguments,
 * commit no data to the database, and are flagged with the testMethod
 * keyword in the method definition.
 *
 * All test methods in an org are executed whenever Apex code is deployed
 * to a production org to confirm correctness, ensure code
 * coverage, and prevent regressions. All Apex classes are
 * required to have at least 75% code coverage in order to be deployed
 * to a production org. In addition, all triggers must have some code coverage.
 * 
 * The @isTest class annotation indicates this class only contains test
 * methods. Classes defined with the @isTest annotation do not count against
 * the org size limit for all Apex scripts.
 *
 * See the Apex Language Reference for more information about Testing and Code Coverage.
 */
@isTest
private class AccountTrigger_Test {

    @TestSetup
    static void makeData(){
        Account testAcc = new Account();
        testAcc.Name = 'Test Account';
        insert testAcc;

        Opportunity testOpp = new Opportunity();
        testOpp.Name = 'Test Opportunity';
        testOpp.StageName = 'Perception Analysis';
        testOpp.CloseDate = Date.today().addMonths(1);
        testOpp.AccountId = testAcc.Id;
        insert testOpp;
    }

    @isTest
    static void myUnitTest() {
        Account testAcc = [SELECT Id FROM Account WHERE Name = 'Test Account' LIMIT 1];

        Test.startTest();
        try {
            delete testAcc;
            System.assert(false, 'The account should not have been deleted because it has open opportunities.');
        } catch (DmlException e) {
            System.assert(e.getMessage().contains('cannot be deleted'), 'Expected the account not to be deleted due to associated opportunities.');
        }
        Test.stopTest();

        Account acc = [SELECT Id FROM Account WHERE Id = :testAcc.Id];
        System.assertNotEquals(null, acc, 'The account should still exist because it has associated opportunities.');
    }
}

module.exports = {
    updateBalance: updateBalance    
}

var accountIDs = [11,12,21,22,24,31,32,61,62,63,71,72,9];

var balance = resetBalance();

var saft = null;

function resetBalance() {
    let initialBalance = [];

    for(let month = 0; month < 12; month++) {
        let month_balance = {};
        
        for(let i = 0; i < accountIDs.length; i++) {
            let id = accountIDs[i];
            month_balance[id] = { debit: 0.0, credit: 0.0 };
        }

        initialBalance.push(month_balance);
    }
    
    return initialBalance;
}

//console.log(balance);

function updateBalance(data) {
    saft = data;
    let generalLedgerEntries = saft.GeneralLedgerEntries.Journal;

    for (entry in generalLedgerEntries) {
        handleEntry(generalLedgerEntries[entry]);
    }

    //console.log(balance);
}

function handleEntry(entry) {
    let transaction = entry.Transaction;

    if (transaction == null)
        return;

    if (transaction.length == null) {
        handleTransaction(transaction);
    } else {
        for (t in transaction) {
            handleTransaction(transaction[t]);
        }
    }
}

function handleTransaction(transaction) {
    let creditLines = transaction.Lines.CreditLine;
    let debitLines = transaction.Lines.DebitLine;
    let date = transaction.TransactionDate;
    
    if(creditLines != null) {
        if (creditLines.length == null)
            handleCreditLine(creditLines, date);
        else {
            for (line in creditLines)
                handleCreditLine(creditLines[line], date);
        }
    }

    if(debitLines != null) {
        if (debitLines.length == null)
            handleDebitLine(debitLines, date);
        else {
            for (line in debitLines)
                handleDebitLine(debitLines[line], date);
        }
    }
}

function handleCreditLine(line, date) {
    let account = String(line.AccountID);
    let monthNumber = new Date(date).getMonth();

    let account_id = null;
    if ( accountIDs.includes(parseInt(account[0])) )
        account_id = account[0];
    else if ( accountIDs.includes(parseInt(account[0] + account[1])) )
        account_id = account[0] + account[1];
    
    if( account_id != null ) {
        balance[monthNumber][account_id].credit += parseFloat(line.CreditAmount);
    }
}

function handleDebitLine(line, date) {
    let account = String(line.AccountID);
    let monthNumber = new Date(date).getMonth();

    let account_id = null;
    if ( accountIDs.includes(parseInt(account[0])) )
        account_id = account[0];
    else if ( accountIDs.includes(parseInt(account[0] + account[1])) )
        account_id = account[0] + account[1];
    
    if( account_id != null ) {
        balance[monthNumber][account_id].debit += parseFloat(line.DebitAmount);
    }
}


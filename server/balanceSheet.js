
module.exports = {
    updateBalance: updateBalance,
    getCash: getCash,
    getEBITDA: getEBITDA,
    getBank: getBank,
    getAP: getAP,
    getAR: getAR,
    getCOGS: getCOGS
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


/*
function handleJournalEntry(entry) {
    let transaction = entry.Transaction;
    if (transaction == null) {
        return 0;
    }

    let creditAmount = 0;

    if (transaction.length == null) {
        let creditLine = transaction.Lines.CreditLine;
        let month = new Date(transaction.TransactionDate).getMonth();
        creditAmount = handleCreditLines(creditLine, month);
    } else {
        for (let i = 0; i < transaction.length; i++) {
            let creditLine = transaction[i].Lines.CreditLine;
            let month = new Date(transaction[i].TransactionDate).getMonth();
            creditAmount += handleCreditLines(creditLine, month);
        }
    }

    return creditAmount;
}

function handleCreditLines(line, month) {
    if (line.length == null) {
        if (line.AccountID == 7111 || line.AccountID == 7112) {
            revenue[month] += parseFloat(line.CreditAmount);
            return line.CreditAmount;
        } else
            return 0;
    } else {
        let creditAmount = 0;
        for (let i = 0; i < line.length; i++) {
            if (line[i].AccountID == 7111 || line[i].AccountID == 7112) {
                creditAmount += line[i].CreditAmount;
                revenue[month] += parseFloat(line[i].CreditAmount);
            } else
                creditAmount += 0;
        }
        return creditAmount;
    }
}
*/


function getCash(month) {
    let cash = balance[month][11].debit - balance[month][11].credit;
    return cash.toFixed(2);
}

function getEBITDA(month) {
    let c71 = balance[month][71].credit - balance[month][71].debit;
    let c72 = balance[month][72].credit - balance[month][72].debit;
    let c61 = balance[month][61].debit - balance[month][61].credit;
    let c62 = balance[month][62].debit - balance[month][62].credit;
    let c63 = balance[month][63].debit - balance[month][63].credit;

    let ebitda = c71 + c72 - c61 - c62 - c63;

    return ebitda.toFixed(2);
}

function getBank(month) {
    let bank = balance[month][12].debit - balance[month][12].credit;
    return bank.toFixed(2);
}
    
function getAP(month) {
    let ap = balance[month][22].credit - balance[month][22].debit;
    return ap.toFixed(2);
}

function getAR(month) {
    let ar = balance[month][21].debit - balance[month][21].credit;
    return ar.toFixed(2);
}
    
function getCOGS(month) {
    let cogs = balance[month][61].debit - balance[month][61].credit;
    return cogs.toFixed(2);
}

/*
app.get('/getSalesVolume', (req, res) => {

    let salesInvoices = saft.SourceDocuments.SalesInvoices.Invoice;
    let salesVolume = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < salesInvoices.length; i++) {
        let invoiceMonth = salesInvoices[i].InvoiceDate.split('-')[1];
        salesVolume[invoiceMonth - 1] += salesInvoices[i].DocumentTotals.NetTotal;
    }
    return res.status(200).send(salesVolume);
});

app.get('/getRevenue', (req, res) => {
    revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let journalEntries = saft.GeneralLedgerEntries.Journal;
    let rev = 0;
    for (let i = 0; i < journalEntries.length; i++) {
        rev += handleJournalEntry(journalEntries[i]);
    }

    return res.status(200).send(revenue);
});
*/

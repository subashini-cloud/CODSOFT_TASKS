/* =====================================
   VARIABLES
===================================== */

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let currentType = "income";

let editingId = null;


/* =====================================
   ELEMENTS
===================================== */

const form =
    document.getElementById("transactionForm");

const amountInput =
    document.getElementById("amount");

const descriptionInput =
    document.getElementById("description");

const categoryInput =
    document.getElementById("category");

const dateInput =
    document.getElementById("date");

const transactionList =
    document.getElementById("transactionList");

const emptyMessage =
    document.getElementById("emptyMessage");

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");

const searchInput =
    document.getElementById("search");

const filterCategory =
    document.getElementById("filterCategory");

const filterType =
    document.getElementById("filterType");

const submitBtn =
    document.getElementById("submitBtn");

const themeBtn =
    document.getElementById("themeBtn");

const currentDate =
    document.getElementById("currentDate");


/* =====================================
   CURRENT DATE
===================================== */

const today = new Date();

const todayString =
    today.toISOString().split("T")[0];

dateInput.value = todayString;

currentDate.textContent =
    today.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );


/* =====================================
   TRANSACTION TYPE
===================================== */

document.querySelectorAll(".type-btn")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".type-btn")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

            currentType =
                button.dataset.type;

            updateCategories();

        });

    });


/* =====================================
   CATEGORY UPDATE
===================================== */

function updateCategories() {

    if (currentType === "income") {

        categoryInput.innerHTML = `

            <option value="">
                Select Category
            </option>

            <option value="Salary">
                Salary
            </option>

            <option value="Freelance">
                Freelance
            </option>

            <option value="Other">
                Other
            </option>

        `;

    } else {

        categoryInput.innerHTML = `

            <option value="">
                Select Category
            </option>

            <option value="Food">
                Food
            </option>

            <option value="Shopping">
                Shopping
            </option>

            <option value="Transport">
                Transport
            </option>

            <option value="Bills">
                Bills
            </option>

            <option value="Education">
                Education
            </option>

            <option value="Health">
                Health
            </option>

            <option value="Other">
                Other
            </option>

        `;

    }

}


/* =====================================
   ADD / EDIT TRANSACTION
===================================== */

form.addEventListener("submit", function (event) {

    event.preventDefault();


    const amount =
        parseFloat(amountInput.value);

    const description =
        descriptionInput.value.trim();

    const category =
        categoryInput.value;

    const date =
        dateInput.value;


    if (
        !amount ||
        amount <= 0 ||
        !description ||
        !category ||
        !date
    ) {

        alert("Please fill all fields correctly.");

        return;

    }


    /* EDIT */
    if (editingId !== null) {

        const index =
            transactions.findIndex(
                transaction =>
                    transaction.id === editingId
            );

        transactions[index] = {

            id: editingId,

            type: currentType,

            amount: amount,

            description: description,

            category: category,

            date: date

        };


        editingId = null;

        submitBtn.textContent =
            "+ Add Transaction";

    }


    /* ADD */
    else {

        const newTransaction = {

            id: Date.now(),

            type: currentType,

            amount: amount,

            description: description,

            category: category,

            date: date

        };


        transactions.unshift(
            newTransaction
        );

    }


    saveData();

    updateDashboard();

    displayTransactions();

    form.reset();

    dateInput.value = todayString;

    currentType = "income";

    document
        .querySelectorAll(".type-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );

    document
        .querySelector('[data-type="income"]')
        .classList.add("active");

    updateCategories();

});


/* =====================================
   SAVE DATA
===================================== */

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


/* =====================================
   DASHBOARD CALCULATION
===================================== */

function updateDashboard() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(transaction => {

        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        } else {

            totalExpense += transaction.amount;

        }

    });


    const balance =
        totalIncome - totalExpense;


    incomeElement.textContent =
        formatCurrency(totalIncome);

    expenseElement.textContent =
        formatCurrency(totalExpense);

    balanceElement.textContent =
        formatCurrency(balance);


    if (balance < 0) {

        balanceElement.style.color =
            "#e64d4d";

    } else {

        balanceElement.style.color =
            "";

    }

}


/* =====================================
   DISPLAY TRANSACTIONS
===================================== */

function displayTransactions() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    const selectedCategory =
        filterCategory.value;

    const selectedType =
        filterType.value;


    const filtered =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(search) ||

                transaction.category
                    .toLowerCase()
                    .includes(search);


            const matchesCategory =
                selectedCategory === "all" ||
                transaction.category ===
                selectedCategory;


            const matchesType =
                selectedType === "all" ||
                transaction.type === selectedType;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesType
            );

        });


    transactionList.innerHTML = "";


    if (filtered.length === 0) {

        emptyMessage.style.display =
            "block";

        return;

    }


    emptyMessage.style.display =
        "none";


    filtered.forEach(transaction => {

        const item =
            document.createElement("div");

        item.className =
            "transaction";


        const icon =
            transaction.type === "income"
                ? "↑"
                : "↓";


        const amountClass =
            transaction.type === "income"
                ? "amount-income"
                : "amount-expense";


        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        item.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon
                    ${transaction.type}">

                    ${icon}

                </div>


                <div class="transaction-info">

                    <h3>
                        ${escapeHTML(
                            transaction.description
                        )}
                    </h3>

                    <p>
                        ${transaction.category}
                        •
                        ${formatDate(
                            transaction.date
                        )}
                    </p>

                </div>

            </div>


            <div class="transaction-right">

                <strong class="${amountClass}">

                    ${sign}
                    ${formatCurrency(
                        transaction.amount
                    )}

                </strong>


                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(
                            ${transaction.id}
                        )">

                        ✎

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(
                            ${transaction.id}
                        )">

                        ×

                    </button>

                </div>

            </div>

        `;


        transactionList.appendChild(item);

    });

}


/* =====================================
   EDIT TRANSACTION
===================================== */

function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) return;


    editingId = id;


    currentType =
        transaction.type;


    document
        .querySelectorAll(".type-btn")
        .forEach(btn =>
            btn.classList.remove("active")
        );


    document
        .querySelector(
            `[data-type="${currentType}"]`
        )
        .classList.add("active");


    updateCategories();


    amountInput.value =
        transaction.amount;

    descriptionInput.value =
        transaction.description;

    categoryInput.value =
        transaction.category;

    dateInput.value =
        transaction.date;


    submitBtn.textContent =
        "Update Transaction";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =====================================
   DELETE TRANSACTION
===================================== */

function deleteTransaction(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmation) return;


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveData();

    updateDashboard();

    displayTransactions();

}


/* =====================================
   FORMAT CURRENCY
===================================== */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    ).format(amount);

}


/* =====================================
   FORMAT DATE
===================================== */

function formatDate(date) {

    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================
   SEARCH
===================================== */

searchInput.addEventListener(
    "input",
    displayTransactions
);


/* =====================================
   CATEGORY FILTER
===================================== */

filterCategory.addEventListener(
    "change",
    displayTransactions
);


/* =====================================
   TYPE FILTER
===================================== */

filterType.addEventListener(
    "change",
    displayTransactions
);


/* =====================================
   DARK MODE
===================================== */

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeBtn.textContent =
            isDark ? "☀️" : "🌙";


        localStorage.setItem(
            "darkMode",
            isDark
        );

    }
);


/* =====================================
   LOAD DARK MODE
===================================== */

const savedTheme =
    localStorage.getItem("darkMode");


if (savedTheme === "true") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}


/* =====================================
   SECURITY
===================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =====================================
   INITIAL LOAD
===================================== */

updateCategories();

updateDashboard();

displayTransactions();

document.addEventListener("DOMContentLoaded", function () {
    // Initialize quotes array from localStorage or default values
    let quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Do what you can, with what you have, where you are.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance" }
    ];

    // Select DOM elements
    const quoteDisplay = document.getElementById("quoteDisplay");
    const categoryFilter = document.getElementById("categoryFilter");
    const newQuoteText = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");
    const addQuoteBtn = document.getElementById("add-quote-btn");
    const exportBtn = document.getElementById("export-btn");
    const importFileInput = document.getElementById("importFile");
    const newQuoteButton = document.getElementById("newQuote");
    const conflictNotification = document.getElementById("conflictNotification");

    // Simulate server API endpoint URL
    const serverUrl = "https://jsonplaceholder.typicode.com/posts";  // Using a mock URL for this example

    // Function to simulate fetching quotes from the server
    function fetchQuotesFromServer() {
        return new Promise((resolve) => {
            // Simulating a delay as if fetching from a real server
            setTimeout(() => {
                const serverData = [
                    { text: "New quote from server!", category: "Server" },
                    { text: "Another server quote.", category: "Server" }
                ];
                resolve(serverData);
            }, 2000);
        });
    }

    // Function to save quotes to localStorage
    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    // Sync local quotes with server data
    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        // Compare and merge server and local quotes
        if (JSON.stringify(quotes) !== JSON.stringify(serverQuotes)) {
            // If quotes are different, show conflict notification
            conflictNotification.style.display = 'block';
        } else {
            console.log("No conflicts, data is already in sync.");
        }
    }

    // Resolve conflict based on user choice
    function resolveConflict(refresh) {
        if (refresh) {
            // Refresh quotes with server data
            quotes = fetchQuotesFromServer(); // Overwrite local quotes with server quotes
            saveQuotes();
            alert("Data refreshed from server.");
        } else {
            // Keep the local changes (do nothing)
            alert("Your changes have been kept.");
        }
        conflictNotification.style.display = 'none';
    }

    // Display a random quote
    function showRandomQuote() {
        if (quotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const randomQuote = quotes[randomIndex];
            quoteDisplay.innerHTML = `"${randomQuote.text}"<br><strong>Category:</strong> ${randomQuote.category}`;
        } else {
            quoteDisplay.innerHTML = "<p>No quotes available. Add some!</p>";
        }
    }

    // Add new quote and update localStorage
    function addQuote() {
        const quoteText = newQuoteText.value.trim();
        const quoteCategory = newQuoteCategory.value.trim();

        if (quoteText === "" || quoteCategory === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        // Add the new quote to the quotes array
        quotes.push({ text: quoteText, category: quoteCategory });

        // Save updated quotes to localStorage
        saveQuotes();

        // Clear input fields
        newQuoteText.value = "";
        newQuoteCategory.value = "";

        alert("Quote added successfully!");
    }

    // Display quotes based on selected category
    function displayQuotes(filteredQuotes) {
        quoteDisplay.innerHTML = filteredQuotes.length
            ? filteredQuotes.map(quote => `<p>"${quote.text}"<br><strong>Category:</strong> ${quote.category}</p>`).join("")
            : "<p>No quotes found for this category.</p>";
    }

    // Populate category filter dropdown
    function populateCategories() {
        const categories = [...new Set(quotes.map(quote => quote.category))];
        categoryFilter.innerHTML = `<option value="all">All Categories</option>` + 
                                    categories.map(category => `<option value="${category}">${category}</option>`).join("");
    }

    // Filter quotes based on selected category
    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        const filteredQuotes = selectedCategory === "all" 
            ? quotes 
            : quotes.filter(quote => quote.category === selectedCategory);
        displayQuotes(filteredQuotes);
    }

    // Export quotes as JSON
    function exportQuotes() {
        const blob = new Blob([JSON.stringify(quotes)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'quotes.json';
        link.click();
    }

    // Import quotes from JSON file
    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(e) {
            const importedQuotes = JSON.parse(e.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
    }

    // Create the add quote form
    function createAddQuoteForm() {
        const form = document.createElement("div");
        const quoteInput = document.createElement("input");
        quoteInput.id = "newQuoteText";
        quoteInput.type = "text";
        quoteInput.placeholder = "Enter a new quote";
        form.appendChild(quoteInput);

        const categoryInput = document.createElement("input");
        categoryInput.id = "newQuoteCategory";
        categoryInput.type = "text";
        categoryInput.placeholder = "Enter quote category";
        form.appendChild(categoryInput);

        const addButton = document.createElement("button");
        addButton.textContent = "Add Quote";
        addButton.addEventListener("click", addQuote);
        form.appendChild(addButton);

        // Append form to the body or a specific element
        document.body.appendChild(form);
    }

    // Event listeners
    addQuoteBtn.addEventListener("click", addQuote);
    exportBtn.addEventListener("click", exportQuotes);
    importFileInput.addEventListener("change", importFromJsonFile);
    newQuoteButton.addEventListener("click", showRandomQuote);

    // Fetch and sync quotes with the server every 10 seconds (for demo)
    setInterval(syncQuotes, 10000);

    // Initialize page with existing quotes and filtering
    displayQuotes(quotes);
    populateCategories();

    // Create the add quote form on page load
    createAddQuoteForm();
});

1. what is A route handler ? 

A route handler is the function that runs when a specific URL (route) is hit with a specific HTTP method.

In simple words 👉

Route = where the request goes
Route handler = what code runs there

app.get("/health", (req, res) => {
  res.send("Server is healthy");
});

2. what is next() function in node js ?

next() is the function that tells Express to move to the next middleware or route handler in the request-response chain.

next() passes control to the next middleware or route handler.

If you don’t call next() and don’t send a response, the request hangs forever ⛔

app.use((req, res, next) => {
  console.log("Request received");
  next(); // continue
});

✔ Request continues
✔ Route handler runs next

🧩 next() vs Sending Response

Middleware
next();        // move forward
res.send();    // STOP here

⚠️ Never do both

//////////////////////////////

⚠️ Common Mistakes

❌ Forgetting next()
❌ Calling next() after sending response
❌ Using next() in route handler unnecessarily

✅ Best Practices

✔ Use next() only in middleware
✔ Always return res... if sending response
✔ Use centralized error middleware

3. what is app.use vs app.all

app.use() applies middleware to all HTTP methods.
app.all() matches all HTTP methods for a specific route.

🔹 app.use()

What it is
Used to register middleware
Runs for all HTTP methods
Can match partial paths
Executes before route handlers

app.use("/api", (req, res, next) => {
  console.log("API request");
  next();
});


🔹 app.all()

What it is
Used to define a route handler
Matches ALL HTTP methods
Requires an exact path
Usually ends with a response

app.all("/health", (req, res) => {
  res.send("OK");
});



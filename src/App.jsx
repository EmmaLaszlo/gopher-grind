import { useState, useCallback, useEffect } from "react";

/* ════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════ */

const CHALLENGES = [
  { id: 1, title: "Hello, Gopher!", diff: "Easy", xp: 10, cat: "Go Basics",
    lesson: "In Go, `fmt.Println()` prints a line to stdout. The `fmt` package is your go-to for formatted I/O. Every Go program starts with `package main` and a `func main()`.\n\nExample:\n```\nfmt.Println(\"Hi\")\nfmt.Printf(\"Age: %d\", 25)\n```",
    description: 'Print "Hello, World!" to the console.',
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Print Hello, World!\n    \n}',
    solution: 'fmt.Println("Hello, World!")',
    hints: ["Use fmt.Println()", 'Pass "Hello, World!" as the argument'],
    tests: [{ expected: 'Hello, World!' }],
  },
  { id: 2, title: "Short Declarations", diff: "Easy", xp: 15, cat: "Go Basics",
    lesson: "Go has two ways to declare variables:\n\n`var name string = \"Go\"` — explicit type\n`name := \"Go\"` — short declaration (type inferred)\n\nShort declarations (`:=`) are preferred inside functions. The compiler figures out the type for you.",
    description: 'Declare a variable `lang` set to "golang" using short declaration, then print it.',
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Declare lang and print it\n    \n    fmt.Println(lang)\n}',
    solution: 'lang := "golang"',
    hints: ["Use := for short declaration", 'lang := "golang"'],
    tests: [{ expected: "golang" }],
  },
  { id: 3, title: "For Loop", diff: "Easy", xp: 20, cat: "Go Basics",
    lesson: "Go has only ONE loop: `for`. It covers all cases:\n\n```\nfor i := 0; i < 5; i++ { }   // classic\nfor condition { }              // while-style\nfor { }                        // infinite\nfor i, v := range slice { }   // range\n```\n\nNo parentheses needed around the condition!",
    description: "Print numbers 1 through 5 using a for loop.",
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Loop 1 to 5\n    \n}',
    solution: 'for i := 1; i <= 5; i++ {\n        fmt.Println(i)\n    }',
    hints: ["for i := 1; i <= 5; i++", "Put fmt.Println(i) inside the braces"],
    tests: [{ expected: "1 2 3 4 5" }],
  },
  { id: 4, title: "Slices", diff: "Easy", xp: 20, cat: "Go Basics",
    lesson: "Slices are Go's dynamic arrays. Unlike arrays, they can grow.\n\n```\nnums := []int{1, 2, 3}\nnums = append(nums, 4)  // [1, 2, 3, 4]\nlen(nums)               // 4\nnums[0:2]               // [1, 2]\n```\n\n`append()` returns a NEW slice — always reassign it!",
    description: "Create a slice [10, 20, 30], append 40, print it.",
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Create slice and append\n    \n    fmt.Println(nums)\n}',
    solution: 'nums := []int{10, 20, 30}\n    nums = append(nums, 40)',
    hints: ["[]int{10, 20, 30} creates a slice", "nums = append(nums, 40)"],
    tests: [{ expected: "[10 20 30 40]" }],
  },
  { id: 5, title: "Maps", diff: "Medium", xp: 25, cat: "Go Basics",
    lesson: "Maps are key-value stores (like dicts/hashmaps).\n\n```\nm := map[string]int{\"a\": 1}\nm[\"b\"] = 2\nval, ok := m[\"a\"]  // val=1, ok=true\ndelete(m, \"a\")\n```\n\nAlways check the `ok` bool — accessing a missing key returns the zero value, not an error.",
    description: 'Create a map with "Alice":30, "Bob":25. Print Bob\'s age.',
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Create map\n    \n    fmt.Println(ages["Bob"])\n}',
    solution: 'ages := map[string]int{"Alice": 30, "Bob": 25}',
    hints: ["map[string]int{...}", 'Key-value pairs: "Alice": 30'],
    tests: [{ expected: "25" }],
  },
  { id: 6, title: "Multiple Returns", diff: "Medium", xp: 30, cat: "Go Basics",
    lesson: "Go functions can return multiple values — this is idiomatic for error handling.\n\n```\nfunc divide(a, b float64) (float64, error) {\n    if b == 0 {\n        return 0, errors.New(\"div by zero\")\n    }\n    return a / b, nil\n}\nresult, err := divide(10, 0)\n```\n\nAlways check `err != nil` before using the result.",
    description: "Write a function `double` that takes an int and returns (int, string) — the doubled value and \"even\" or \"odd\".",
    starter: 'package main\n\nimport "fmt"\n\n// Write double function\n\nfunc main() {\n    val, parity := double(3)\n    fmt.Println(val, parity)\n}',
    solution: 'func double(n int) (int, string) {\n    if n%2 == 0 {\n        return n * 2, "even"\n    }\n    return n * 2, "odd"\n}',
    hints: ["Return type: (int, string)", "Use n%2 == 0 to check even/odd"],
    tests: [{ expected: '6 odd' }],
  },
  { id: 7, title: "Structs & Methods", diff: "Medium", xp: 30, cat: "Go Basics",
    lesson: "Structs group related data. Methods are functions with a receiver.\n\n```\ntype Dog struct {\n    Name string\n    Age  int\n}\nfunc (d Dog) Bark() string {\n    return d.Name + \" says woof!\"\n}\n```\n\nUse pointer receivers `(d *Dog)` when you need to modify the struct.",
    description: "Define a `Rect` struct with Width, Height (float64). Add an `Area()` method.",
    starter: 'package main\n\nimport "fmt"\n\n// Define Rect and Area method\n\nfunc main() {\n    r := Rect{Width: 5, Height: 3}\n    fmt.Println(r.Area())\n}',
    solution: 'type Rect struct {\n    Width  float64\n    Height float64\n}\nfunc (r Rect) Area() float64 {\n    return r.Width * r.Height\n}',
    hints: ["type Rect struct { Width float64; Height float64 }", "func (r Rect) Area() float64"],
    tests: [{ expected: "15" }],
  },
  { id: 8, title: "Interfaces", diff: "Hard", xp: 40, cat: "Go Basics",
    lesson: "Interfaces define behavior, not data. A type implements an interface by implementing its methods — no `implements` keyword.\n\n```\ntype Speaker interface {\n    Speak() string\n}\ntype Cat struct{}\nfunc (c Cat) Speak() string { return \"Meow\" }\n// Cat automatically satisfies Speaker\n```\n\nThis is structural typing — very powerful for decoupling.",
    description: "Define a `Shape` interface with `Area() float64`. Make `Circle` implement it.",
    starter: 'package main\n\nimport (\n    "fmt"\n    "math"\n)\n\n// Define Shape interface and Circle\n\nfunc main() {\n    var s Shape = Circle{Radius: 5}\n    fmt.Println(s.Area())\n}',
    solution: 'type Shape interface {\n    Area() float64\n}\ntype Circle struct {\n    Radius float64\n}\nfunc (c Circle) Area() float64 {\n    return math.Pi * c.Radius * c.Radius\n}',
    hints: ["type Shape interface { Area() float64 }", "Circle needs an Area() method"],
    tests: [{ expected: "78.53" }],
  },
  { id: 9, title: "Goroutines & Channels", diff: "Hard", xp: 45, cat: "Go Basics",
    lesson: "Goroutines are lightweight threads launched with `go`.\n\nUse channels to communicate:\n```\nch := make(chan string)\ngo func() { ch <- \"hello\" }()\nmsg := <-ch  // blocks until value sent\n```\n\nChannels are Go's primary concurrency primitive.",
    description: "Create a goroutine that sends \"ping\" on a channel. Receive and print it in main.",
    starter: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Create channel, goroutine, receive\n    \n}',
    solution: 'ch := make(chan string)\n    go func() { ch <- "ping" }()\n    fmt.Println(<-ch)',
    hints: ["ch := make(chan string)", "go func() { ch <- \"ping\" }()"],
    tests: [{ expected: "ping" }],
  },
  { id: 10, title: "Two Sum", diff: "Easy", xp: 25, cat: "Algorithms",
    lesson: "The classic Two Sum: find two numbers that add to a target.\n\nOptimal O(n): use a hash map. For each number, check if `target - num` exists in the map.\n\n```\nseen := map[int]int{}\nfor i, n := range nums {\n    if j, ok := seen[target-n]; ok {\n        return [2]int{j, i}\n    }\n    seen[n] = i\n}\n```",
    description: "Given nums=[2,7,11,15], target=9, return the two indices that sum to target.",
    starter: 'package main\n\nimport "fmt"\n\nfunc twoSum(nums []int, target int) [2]int {\n    // Your solution\n    return [2]int{}\n}\n\nfunc main() {\n    fmt.Println(twoSum([]int{2,7,11,15}, 9))\n}',
    solution: 'seen := map[int]int{}\n    for i, n := range nums {\n        if j, ok := seen[target-n]; ok {\n            return [2]int{j, i}\n        }\n        seen[n] = i\n    }',
    hints: ["Use a map to store seen values", "Check if target-n exists in the map"],
    tests: [{ expected: "[0 1]" }],
  },
  { id: 11, title: "Reverse String", diff: "Easy", xp: 20, cat: "Algorithms",
    lesson: "Strings in Go are immutable byte slices. To reverse, convert to a rune slice (handles Unicode), then swap from both ends.\n\n```\nrunes := []rune(s)\nfor i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n    runes[i], runes[j] = runes[j], runes[i]\n}\n```\n\nTime: O(n), Space: O(n).",
    description: 'Write a function that reverses a string. reverse("hello") → "olleh"',
    starter: 'package main\n\nimport "fmt"\n\nfunc reverse(s string) string {\n    // Your solution\n    return ""\n}\n\nfunc main() {\n    fmt.Println(reverse("hello"))\n}',
    solution: 'runes := []rune(s)\n    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {\n        runes[i], runes[j] = runes[j], runes[i]\n    }\n    return string(runes)',
    hints: ["Convert to []rune first", "Two-pointer swap from ends"],
    tests: [{ expected: "olleh" }],
  },
  { id: 12, title: "Binary Search", diff: "Medium", xp: 30, cat: "Algorithms",
    lesson: "Binary search on a SORTED array: O(log n).\n\n```\nlo, hi := 0, len(arr)-1\nfor lo <= hi {\n    mid := lo + (hi-lo)/2\n    if arr[mid] == target { return mid }\n    if arr[mid] < target { lo = mid+1 }\n    else { hi = mid-1 }\n}\n```\n\nUse `lo + (hi-lo)/2` to avoid integer overflow.",
    description: "Implement binary search. Return the index of target, or -1.",
    starter: 'package main\n\nimport "fmt"\n\nfunc binarySearch(nums []int, target int) int {\n    // Your solution\n    return -1\n}\n\nfunc main() {\n    fmt.Println(binarySearch([]int{1,3,5,7,9}, 7))\n}',
    solution: 'lo, hi := 0, len(nums)-1\n    for lo <= hi {\n        mid := lo + (hi-lo)/2\n        if nums[mid] == target { return mid }\n        if nums[mid] < target { lo = mid + 1 } else { hi = mid - 1 }\n    }',
    hints: ["lo, hi := 0, len(nums)-1", "mid := lo + (hi-lo)/2"],
    tests: [{ expected: "3" }],
  },
  { id: 13, title: "Merge Sorted Lists", diff: "Medium", xp: 35, cat: "Algorithms",
    lesson: "Merge two sorted slices: use two pointers, compare heads, take smaller.\n\n```\nfor i < len(a) && j < len(b) {\n    if a[i] <= b[j] { take a[i]; i++ }\n    else { take b[j]; j++ }\n}\n// append remaining\n```\n\nTime: O(n+m). This is the merge step of merge sort!",
    description: "Merge two sorted slices into one sorted slice.",
    starter: 'package main\n\nimport "fmt"\n\nfunc merge(a, b []int) []int {\n    // Your solution\n    return nil\n}\n\nfunc main() {\n    fmt.Println(merge([]int{1,3,5}, []int{2,4,6}))\n}',
    solution: 'result := []int{}\n    i, j := 0, 0\n    for i < len(a) && j < len(b) {\n        if a[i] <= b[j] { result = append(result, a[i]); i++ } else { result = append(result, b[j]); j++ }\n    }\n    result = append(result, a[i:]...)\n    result = append(result, b[j:]...)\n    return result',
    hints: ["Two pointers: i for a, j for b", "Don't forget remaining elements with a[i:]..."],
    tests: [{ expected: "[1 2 3 4 5 6]" }],
  },
  { id: 14, title: "Max Subarray (Kadane)", diff: "Hard", xp: 45, cat: "Algorithms",
    lesson: "Kadane's Algorithm: O(n) max sum contiguous subarray.\n\nAt each position, extend current subarray or start fresh:\n\n```\nmaxSum, curr := nums[0], nums[0]\nfor _, n := range nums[1:] {\n    if curr+n > n { curr += n } else { curr = n }\n    if curr > maxSum { maxSum = curr }\n}\n```\n\nInterview favorite — know it by heart!",
    description: "Find the contiguous subarray with the largest sum.",
    starter: 'package main\n\nimport "fmt"\n\nfunc maxSubarray(nums []int) int {\n    // Kadane\'s algorithm\n    return 0\n}\n\nfunc main() {\n    fmt.Println(maxSubarray([]int{-2,1,-3,4,-1,2,1,-5,4}))\n}',
    solution: 'maxSum := nums[0]\n    curr := nums[0]\n    for _, n := range nums[1:] {\n        if curr+n > n { curr += n } else { curr = n }\n        if curr > maxSum { maxSum = curr }\n    }\n    return maxSum',
    hints: ["Track current sum and max sum", "curr = max(curr+n, n)"],
    tests: [{ expected: "6" }],
  },
  { id: 20, title: "URL Shortener", diff: "Medium", xp: 35, cat: "System Design",
    lesson: "Key components:\n• API: POST /shorten, GET /:code → redirect\n• Hash/encode URL to short code (base62 of auto-increment ID)\n• Database: code → original URL mapping\n• Cache (Redis) for hot URLs\n\nScale: read-heavy (100:1) → cache aggressively\nBase62 with 7 chars = 3.5 trillion URLs\nUse consistent hashing for distributed cache",
    description: "Design a URL shortener. What are the main components?",
    starter: '// Describe your design:\n// 1. API endpoints\n// 2. Short code generation\n// 3. Storage\n// 4. Scale to 1M+ URLs/day',
    solution: 'POST /shorten returns short URL, GET /:code 302 redirects\nbase62 encode auto-increment ID\nSQL or NoSQL for mapping, Redis cache\nCache aggressively, CDN, shard by code prefix',
    hints: ["Read vs write ratio?", "How to ensure unique codes?"],
    tests: [],
  },
  { id: 21, title: "Rate Limiter", diff: "Medium", xp: 35, cat: "System Design",
    lesson: "Common algorithms:\n• Token Bucket: fills at fixed rate, allows bursts\n• Sliding Window: count requests in rolling window\n• Leaky Bucket: fixed processing rate\n\nDistributed: Redis + Lua for atomic check-and-decrement\nReturn 429 with Retry-After header",
    description: "Design a rate limiter. Which algorithm and why?",
    starter: '// Your design:\n// 1. Algorithm choice\n// 2. Data structure\n// 3. Distributed approach\n// 4. Response headers',
    solution: 'Token bucket for burst tolerance\nRedis key=user:endpoint with TTL\nLua scripts for atomicity\n429 + X-RateLimit-Remaining + Retry-After',
    hints: ["Token bucket is most common", "Redis is key for distributed"],
    tests: [],
  },
  { id: 22, title: "Chat System", diff: "Hard", xp: 50, cat: "System Design",
    lesson: "Real-time messaging:\n• WebSocket for delivery\n• Message queue (Kafka) for async\n• Presence service: heartbeat-based\n• Fan-out: on-write for small groups, on-read for large\n\nStorage: Cassandra for messages, SQL for users, S3+CDN for media",
    description: "Design a chat system. Cover real-time delivery, storage, groups.",
    starter: '// Your design:\n// 1. Real-time delivery\n// 2. Storage\n// 3. Group chat fan-out\n// 4. Offline users',
    solution: 'WebSockets + long-polling fallback\nKafka queue, Cassandra messages\nSmall groups: fan-out on write. Large: on read\nStore offline messages, deliver on reconnect',
    hints: ["WebSockets for real-time", "Small vs large groups differ"],
    tests: [],
  },
  { id: 30, title: "REST vs gRPC", diff: "Medium", xp: 30, cat: "Architecture",
    lesson: "REST: HTTP/JSON, human-readable, browser-friendly\ngRPC: HTTP/2 + Protobuf, binary, streaming, ~10x faster serialization\n\nREST for: public APIs, CRUD, browsers\ngRPC for: microservices, low latency, streaming\nConsider gRPC-Gateway for both",
    description: "When would you choose gRPC over REST? Give 3 scenarios.",
    starter: '// 3 scenarios where gRPC beats REST:\n// 1.\n// 2.\n// 3.',
    solution: '1. Microservice mesh — protobuf 10x faster than JSON\n2. Real-time streaming — native bidirectional\n3. Polyglot services — auto-generated typed clients',
    hints: ["Think performance, streaming, type safety"],
    tests: [],
  },
  { id: 31, title: "Database Sharding", diff: "Hard", xp: 45, cat: "Architecture",
    lesson: "Sharding splits data across databases.\n\nStrategies:\n• Hash-based: hash(key) % N\n• Range-based: A-M → shard 1\n• Directory-based: lookup table\n\nChallenges: cross-shard joins, resharding, hot shards\nConsistent hashing minimizes data movement",
    description: "Explain sharding. What strategy for a social media app?",
    starter: '// Explain:\n// 1. What is sharding\n// 2. Strategy for social media\n// 3. Resharding approach\n// 4. Main tradeoff',
    solution: 'Horizontal partitioning across DB instances\nHash on user_id (most queries are per-user)\nConsistent hashing for minimal data movement\nNo cross-shard joins — denormalize or async aggregate',
    hints: ["Most social queries are per-user", "Consistent hashing is key"],
    tests: [],
  },
  { id: 32, title: "Event-Driven Arch", diff: "Hard", xp: 45, cat: "Architecture",
    lesson: "Services communicate through events instead of direct calls.\n\nPatterns:\n• Event Sourcing: store events, replay to rebuild state\n• CQRS: separate read/write models\n• Pub/Sub: publishers emit, subscribers react\n\nBenefits: loose coupling, audit trail, replay\nDrawbacks: eventual consistency, debugging complexity",
    description: "When events over request-response? What tradeoffs?",
    starter: '// Explain:\n// 1. When to use events\n// 2. Event sourcing benefit\n// 3. Main challenge\n// 4. Tool choice',
    solution: 'Events for loose coupling, audit trails, fan-out\nEvent sourcing: full history + replay\nEventual consistency + idempotent consumers needed\nKafka for ordered logs, RabbitMQ for routing',
    hints: ["Think about coupling", "Ordering and idempotency matter"],
    tests: [],
  },
  { id: 40, title: "Big O Basics", diff: "Easy", xp: 20, cat: "Concepts",
    lesson: "Big O describes how runtime grows with input size.\n\n• O(1): hash lookup\n• O(log n): binary search\n• O(n): single loop\n• O(n log n): merge sort\n• O(n²): nested loops\n• O(2ⁿ): recursive fibonacci\n\nAlways state time AND space complexity in interviews.",
    description: "What's the time complexity of linear search, binary search, and sorting?",
    starter: '// Big O for:\n// 1. Linear search\n// 2. Binary search\n// 3. Best general sort',
    solution: 'O(n) — check each element\nO(log n) — halves each step\nO(n log n) — comparison sort lower bound',
    hints: ["How does work scale as input doubles?"],
    tests: [],
  },
  { id: 41, title: "Stack Implementation", diff: "Easy", xp: 20, cat: "Concepts",
    lesson: "Stack: LIFO (Last In, First Out)\n• Push/Pop from top\n• Use cases: undo, call stack, DFS, bracket matching\n\nIn Go: use a slice with append (push) and reslice (pop).\n\nQueue: FIFO — enqueue back, dequeue front. Use for BFS, scheduling.",
    description: "Implement a stack with Push and Pop using a slice.",
    starter: 'package main\n\nimport "fmt"\n\ntype Stack struct {\n    items []int\n}\n\n// Add Push and Pop methods\n\nfunc main() {\n    s := Stack{}\n    s.Push(1)\n    s.Push(2)\n    fmt.Println(s.Pop())\n}',
    solution: 'func (s *Stack) Push(val int) {\n    s.items = append(s.items, val)\n}\nfunc (s *Stack) Pop() int {\n    n := len(s.items)\n    val := s.items[n-1]\n    s.items = s.items[:n-1]\n    return val\n}',
    hints: ["Push: append to slice", "Pop: take last, reslice"],
    tests: [{ expected: "2" }],
  },
];

const FLASHCARDS = [
  { id: 1, cat: "Go", q: "Zero value of a string in Go?", a: 'Empty string ""' },
  { id: 2, cat: "Go", q: "make() vs new()?", a: "make() initializes slices/maps/channels. new() allocates zeroed memory, returns pointer." },
  { id: 3, cat: "Go", q: "What is a goroutine?", a: "Lightweight thread managed by Go runtime. Launched with `go`. Thousands can run concurrently." },
  { id: 4, cat: "Go", q: "How do channels work?", a: "Typed conduits between goroutines. Unbuffered block until both sides ready. Buffered have capacity." },
  { id: 5, cat: "Go", q: "What does defer do?", a: "Schedules function to run when surrounding function returns. LIFO order. Great for cleanup." },
  { id: 6, cat: "Go", q: "Slice vs Array?", a: "Arrays: fixed size (part of type). Slices: dynamic views over arrays, grow with append()." },
  { id: 7, cat: "Go", q: "Interface in Go?", a: "Set of method signatures. Types implement by having the methods — no explicit keyword needed." },
  { id: 8, cat: "Go", q: "What is nil in Go?", a: "Zero value for pointers, interfaces, maps, slices, channels, functions. Each behaves differently." },
  { id: 9, cat: "Algo", q: "BFS vs DFS?", a: "BFS: shortest path, level-order (queue). DFS: cycle detection, topological sort, backtracking (stack)." },
  { id: 10, cat: "Algo", q: "What is dynamic programming?", a: "Overlapping subproblems + caching results. Top-down (memoization) or bottom-up (tabulation)." },
  { id: 11, cat: "Algo", q: "Hash table complexity?", a: "Average O(1) insert/lookup/delete. Worst O(n) from collisions. Load factor triggers resize." },
  { id: 12, cat: "Algo", q: "What is a heap?", a: "Complete binary tree. Min-heap: parent ≤ children. O(log n) insert/extract. Used for priority queues." },
  { id: 13, cat: "System", q: "CAP theorem?", a: "Pick 2 of 3: Consistency, Availability, Partition tolerance. Partitions are inevitable → choose C or A." },
  { id: 14, cat: "System", q: "Consistent hashing?", a: "Keys and nodes on a ring. Adding/removing nodes only remaps nearby keys. Minimizes data movement." },
  { id: 15, cat: "System", q: "What is a CDN?", a: "Caches static content at edge servers globally. Reduces latency by serving from nearby locations." },
  { id: 16, cat: "System", q: "Database indexing?", a: "B-tree structure that speeds reads at cost of slower writes + storage. Like a book's index." },
  { id: 17, cat: "System", q: "SQL vs NoSQL?", a: "SQL: structured, ACID, joins. NoSQL: flexible schema, horizontal scaling, eventual consistency." },
  { id: 18, cat: "System", q: "Load balancing?", a: "Distribute traffic across servers. Strategies: round-robin, least connections, IP hash. L4 vs L7." },
  { id: 19, cat: "Arch", q: "Monolith vs Microservices?", a: "Monolith: simple deploy, hard to scale parts. Micro: independent scaling, adds network complexity." },
  { id: 20, cat: "Arch", q: "What is CQRS?", a: "Separate read and write models. Independent scaling and optimization for each side." },
  { id: 21, cat: "Arch", q: "Circuit breakers?", a: "Stops calling failing services. States: Closed → Open → Half-Open. Prevents cascade failures." },
  { id: 22, cat: "Arch", q: "Eventual consistency?", a: "All replicas converge after write, but reads may be stale temporarily. Tradeoff for availability." },
  { id: 23, cat: "Arch", q: "12-Factor App?", a: "Config in env vars, stateless processes, backing services attached, disposability, dev/prod parity, logs as streams." },
  { id: 24, cat: "Arch", q: "API Gateway?", a: "Single entry for microservices. Handles routing, auth, rate limiting, caching. Kong, AWS API Gateway." },
];

const FC_CATS = ["All", "Go", "Algo", "System", "Arch"];
const CH_CATS = ["All", "Go Basics", "Algorithms", "System Design", "Architecture", "Concepts"];

const ds = (d) => {
  if (d === "Easy") return { background: "#0f2d22", color: "#34d399" };
  if (d === "Medium") return { background: "#2d2410", color: "#fbbf24" };
  return { background: "#2d1414", color: "#f87171" };
};

/* ════════════════════════════════════════════
   GO PLAYGROUND HELPER
   ════════════════════════════════════════════ */

function openPlayground(code) {
  // Go Playground accepts code via a form POST to get a share link,
  // but simplest approach: encode in URL fragment and use the snippet endpoint
  const encoded = encodeURIComponent(code);
  window.open(`https://go.dev/play/#code=${encoded}`, "_blank");
}

/* ════════════════════════════════════════════
   SCREENS
   ════════════════════════════════════════════ */

function HomeScreen({ xp, streak, done, saved, cat, setCat, onSelect, toggleSave }) {
  const filtered = cat === "All" ? CHALLENGES : cat === "Saved" ? CHALLENGES.filter(c => saved.has(c.id)) : CHALLENGES.filter(c => c.cat === cat);
  const level = Math.floor(xp / 75) + 1;
  const pct = ((xp % 75) / 75) * 100;
  const allCats = [...CH_CATS, "Saved"];

  return (
    <div className="s">
      <div className="hero">
        <div className="hero-top">
          <div>
            <div className="logo">🐹 <span className="logo-t">GopherGrind</span></div>
            <div className="sub">Level {level} • {done.size}/{CHALLENGES.length} crushed</div>
          </div>
          <div className="streak">🔥 <b>{streak}</b></div>
        </div>
        <div className="xp-track"><div className="xp-fill" style={{ width: `${pct}%` }} /></div>
        <div className="xp-row"><span>{xp} XP</span><span>{level * 75} XP → Lvl {level + 1}</span></div>
      </div>

      <div className="tabs">
        {allCats.map(c => (
          <button key={c} className={`tab ${cat === c ? "on" : ""} ${c === "Saved" ? "saved-tab" : ""}`} onClick={() => setCat(c)}>
            {c === "Saved" ? `🔖 Saved (${saved.size})` : c}
          </button>
        ))}
      </div>

      <div className="list">
        {filtered.length === 0 && (
          <div className="empty">
            {cat === "Saved" ? "No saved questions yet. Tap the 🔖 bookmark on any challenge!" : "No challenges in this category."}
          </div>
        )}
        {filtered.map((ch, i) => {
          const d = done.has(ch.id);
          const s = saved.has(ch.id);
          return (
            <div key={ch.id} className="card-wrap">
              <button className={`card ${d ? "done" : ""}`} onClick={() => onSelect(ch)}>
                <div className="card-l">
                  <div className={`card-i ${d ? "done" : ""}`}>{d ? "✓" : i + 1}</div>
                  <div>
                    <div className="card-t">{ch.title}</div>
                    <div className="card-m">
                      <span className="diff" style={ds(ch.diff)}>{ch.diff}</span>
                      <span className="card-c">{ch.cat}</span>
                    </div>
                  </div>
                </div>
                <span className="xp-tag">+{ch.xp}</span>
              </button>
              <button className={`save-btn ${s ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSave(ch.id); }}>
                {s ? "🔖" : "☆"}
              </button>
            </div>
          );
        })}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function ChallengeScreen({ ch, isDone, isSaved, onComplete, onNext, onBack, toggleSave }) {
  const [code, setCode] = useState(ch.starter);
  const [hint, setHint] = useState(-1);
  const [sol, setSol] = useState(false);
  const [ai, setAi] = useState("");
  const [aiL, setAiL] = useState(false);
  const [tried, setTried] = useState(false);
  const [showLesson, setShowLesson] = useState(true);

  // Reset state when challenge changes
  useEffect(() => {
    setCode(ch.starter);
    setHint(-1);
    setSol(false);
    setAi("");
    setAiL(false);
    setTried(false);
    setShowLesson(true);
  }, [ch.id]);

  const askAI = async () => {
    setAiL(true); setAi("");
    // The AI tutor needs a small backend that holds the API key, so the key is
    // never exposed in the browser. Set VITE_TUTOR_URL to that endpoint; it
    // receives { prompt } and returns { text }.
    const tutorUrl = import.meta.env.VITE_TUTOR_URL;
    if (!tutorUrl) {
      setAi("The AI tutor isn't connected in this build. Try the hints!");
      setAiL(false);
      return;
    }
    try {
      const r = await fetch(tutorUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You're a Go/CS tutor. Challenge: "${ch.title}" — ${ch.description}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nGive a SHORT encouraging hint (2-3 sentences). Don't reveal the answer.`,
        }),
      });
      const d = await r.json();
      setAi(d.text || "Try the hints!");
    } catch { setAi("Couldn't reach the AI tutor. Try hints!"); }
    setAiL(false);
  };

  const submit = () => {
    setTried(true);
    const n = s => s.replace(/\s+/g, " ").toLowerCase().trim();
    const userNorm = n(code);
    const solNorm = n(ch.solution);
    const keywords = solNorm.split(/\s+/).filter(w => w.length > 3);
    const matchCount = keywords.filter(w => userNorm.includes(w)).length;
    if (userNorm.includes(solNorm) || matchCount >= keywords.length * 0.6) {
      onComplete();
    }
  };

  const hasCode = ch.starter.includes("package main") || ch.starter.includes("func ");
  const d = ds(ch.diff);

  return (
    <div className="s">
      <div className="toolbar">
        <button className="back" onClick={onBack}>←</button>
        <div className="toolbar-mid">
          <span className="toolbar-t">{ch.title}</span>
          <span className="diff" style={{ ...d, marginLeft: 6 }}>{ch.diff}</span>
        </div>
        <button className={`save-icon ${isSaved ? "on" : ""}`} onClick={() => toggleSave(ch.id)}>
          {isSaved ? "🔖" : "☆"}
        </button>
        <span className="xp-tag">+{ch.xp}</span>
      </div>

      <div className="body">
        <button className="lesson-toggle" onClick={() => setShowLesson(!showLesson)}>
          📖 Lesson {showLesson ? "▾" : "▸"}
        </button>
        {showLesson && (
          <div className="lesson">
            {ch.lesson.split("\n").map((line, i) => {
              if (line.startsWith("```")) return null;
              if (line.startsWith("•")) return <div key={i} className="lesson-bullet">{line}</div>;
              return <div key={i} className="lesson-line">{line}</div>;
            })}
          </div>
        )}

        <div className="desc">
          <p>{ch.description}</p>
          {ch.tests && ch.tests.map((t, i) => (
            <div key={i} className="expected">
              <span className="exp-label">Expected →</span>
              <code>{t.expected}</code>
            </div>
          ))}
        </div>

        <div className="editor">
          <div className="editor-bar">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="fname">{hasCode ? "main.go" : "notes.txt"}</span>
          </div>
          <textarea value={code} onChange={e => { setCode(e.target.value); setTried(false); }}
            spellCheck={false} autoCapitalize="off" autoCorrect="off" />
        </div>

        {/* Go Playground button */}
        {hasCode && (
          <button className="playground-btn" onClick={() => openPlayground(code)}>
            ▶️ Test in Go Playground ↗
          </button>
        )}

        {hint >= 0 && (
          <div className="hint-box">
            <div className="hint-label">💡 Hint {hint + 1}/{ch.hints.length}</div>
            <p>{ch.hints[hint]}</p>
          </div>
        )}

        {(aiL || ai) && (
          <div className="ai-box">
            <div className="ai-label">🤖 AI Tutor</div>
            {aiL ? <p className="dim">Thinking...</p> : <p>{ai}</p>}
          </div>
        )}

        {sol && (
          <div className="sol-box">
            <div className="sol-label">Solution</div>
            <code>{ch.solution}</code>
          </div>
        )}

        {tried && !isDone && <div className="wrong">Not quite — try again or use a hint!</div>}
        {isDone && (
          <div className="success">
            <span>✅ +{ch.xp} XP</span>
            {onNext && <button className="next-inline" onClick={onNext}>Next →</button>}
          </div>
        )}
      </div>

      <div className="actions">
        <div className="action-row">
          <button className="btn hint" onClick={() => hint < ch.hints.length - 1 && setHint(h => h + 1)}>💡 Hint</button>
          <button className="btn ai" onClick={askAI} disabled={aiL}>🤖 AI</button>
          <button className="btn sol" onClick={() => setSol(!sol)}>{sol ? "Hide" : "Answer"}</button>
        </div>
        {!isDone ? (
          <button className="submit" onClick={submit}>⚡ Submit</button>
        ) : onNext ? (
          <button className="submit nxt" onClick={onNext}>Next Challenge →</button>
        ) : (
          <button className="submit" onClick={onBack}>🏠 Home</button>
        )}
      </div>
    </div>
  );
}

function FlashcardScreen({ fcCat, setFcCat }) {
  const cards = fcCat === "All" ? FLASHCARDS : FLASHCARDS.filter(f => f.cat === fcCat);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[idx % cards.length] || cards[0];

  const next = () => { setFlipped(false); setIdx(i => (i + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIdx(i => (i - 1 + cards.length) % cards.length); };

  return (
    <div className="s">
      <div className="fc-header">
        <div className="logo">🃏 <span className="logo-t">Flashcards</span></div>
        <div className="fc-count">{(idx % cards.length) + 1} / {cards.length}</div>
      </div>

      <div className="tabs">
        {FC_CATS.map(c => (
          <button key={c} className={`tab ${fcCat === c ? "on" : ""}`} onClick={() => { setFcCat(c); setIdx(0); setFlipped(false); }}>{c}</button>
        ))}
      </div>

      <div className="fc-area">
        <button className="fc-card" onClick={() => setFlipped(!flipped)}>
          <div className="fc-side-label">{flipped ? "ANSWER" : "QUESTION"}</div>
          <div className="fc-cat-badge">{card.cat}</div>
          <div className={`fc-text ${flipped ? "fc-answer" : ""}`}>
            {flipped ? card.a : card.q}
          </div>
          <div className="fc-tap">{flipped ? "Tap for question" : "Tap to reveal"}</div>
        </button>

        <div className="fc-nav">
          <button className="fc-btn" onClick={prev}>← Prev</button>
          <button className="fc-btn" onClick={() => { setFlipped(false); setIdx(Math.floor(Math.random() * cards.length)); }}>🔀</button>
          <button className="fc-btn" onClick={next}>Next →</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   APP
   ════════════════════════════════════════════ */

export default function GopherGrind() {
  const [tab, setTab] = useState("home");
  const [ch, setCh] = useState(null);
  const [done, setDone] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [xp, setXP] = useState(0);
  const [streak] = useState(3);
  const [cat, setCat] = useState("All");
  const [fcCat, setFcCat] = useState("All");
  const [celeb, setCeleb] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem("gg-state");
        if (raw) {
          const s = JSON.parse(raw);
          if (s.done) setDone(new Set(s.done));
          if (s.saved) setSaved(new Set(s.saved));
          if (s.xp != null) setXP(s.xp);
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Save state on changes
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        localStorage.setItem("gg-state", JSON.stringify({
          done: [...done], saved: [...saved], xp
        }));
      } catch {}
    })();
  }, [done, saved, xp, loaded]);

  const complete = useCallback((c) => {
    if (!done.has(c.id)) {
      setDone(prev => new Set([...prev, c.id]));
      setXP(prev => prev + c.xp);
      setCeleb(true);
      setTimeout(() => setCeleb(false), 2000);
    }
  }, [done]);

  const toggleSave = useCallback((id) => {
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const nextChallenge = useCallback(() => {
    if (!ch) return;
    const idx = CHALLENGES.findIndex(c => c.id === ch.id);
    if (idx < CHALLENGES.length - 1) {
      setCh(CHALLENGES[idx + 1]);
    } else { setTab("home"); setCh(null); }
  }, [ch]);

  const isLast = ch && CHALLENGES.findIndex(c => c.id === ch.id) >= CHALLENGES.length - 1;

  return (
    <div className="app">
      <style>{CSS}</style>

      {celeb && (
        <div className="celeb">
          <div className="celeb-inner">
            <div className="celeb-emoji">🎉</div>
            <div className="celeb-t">Nice work!</div>
          </div>
        </div>
      )}

      {tab === "home" && !ch && (
        <HomeScreen xp={xp} streak={streak} done={done} saved={saved} cat={cat} setCat={setCat}
          onSelect={c => { setCh(c); setTab("challenge"); }} toggleSave={toggleSave} />
      )}
      {tab === "challenge" && ch && (
        <ChallengeScreen ch={ch} isDone={done.has(ch.id)} isSaved={saved.has(ch.id)}
          onComplete={() => complete(ch)}
          onNext={!isLast ? nextChallenge : null}
          onBack={() => { setTab("home"); setCh(null); }}
          toggleSave={toggleSave} />
      )}
      {tab === "flash" && <FlashcardScreen fcCat={fcCat} setFcCat={setFcCat} />}

      <div className="nav">
        <button className={`nav-btn ${tab === "home" && !ch ? "on" : ""}`} onClick={() => { setTab("home"); setCh(null); }}>
          <span className="nav-icon">🏠</span><span>Practice</span>
        </button>
        <button className={`nav-btn ${tab === "flash" ? "on" : ""}`} onClick={() => setTab("flash")}>
          <span className="nav-icon">🃏</span><span>Cards</span>
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CSS
   ════════════════════════════════════════════ */

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #060a13; }

.app {
  width: 100%; max-width: 500px; height: 100vh; height: 100dvh;
  margin: 0 auto; background: #0b1022; color: #e4e8f1;
  font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  display: flex; flex-direction: column; position: relative; overflow: hidden;
}
.s { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }

.hero { padding: 18px 20px 16px; background: linear-gradient(160deg, #101832, #180e38); border-bottom: 1px solid rgba(255,255,255,.05); flex-shrink: 0; }
.hero-top { display: flex; justify-content: space-between; align-items: flex-start; }
.logo { font-size: 22px; font-weight: 800; }
.logo-t { background: linear-gradient(135deg, #00d4aa 30%, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.sub { font-size: 12px; color: rgba(228,232,241,.4); margin-top: 2px; }
.streak { font-size: 14px; background: rgba(255,100,40,.12); border: 1px solid rgba(255,100,40,.25); padding: 5px 12px; border-radius: 18px; color: #ff8347; }
.xp-track { height: 6px; background: rgba(255,255,255,.07); border-radius: 3px; margin-top: 14px; overflow: hidden; }
.xp-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, #00d4aa, #8b5cf6); transition: width .5s; }
.xp-row { display: flex; justify-content: space-between; font-size: 11px; color: rgba(228,232,241,.35); margin-top: 5px; }

.tabs { display: flex; gap: 6px; padding: 10px 20px; overflow-x: auto; -webkit-overflow-scrolling: touch; flex-shrink: 0; }
.tabs::-webkit-scrollbar { display: none; }
.tab { padding: 6px 13px; border-radius: 14px; font-size: 12px; font-weight: 600; white-space: nowrap; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.04); color: rgba(228,232,241,.45); cursor: pointer; -webkit-appearance: none; outline: none; }
.tab.on { background: rgba(0,212,170,.12); color: #00d4aa; border-color: rgba(0,212,170,.25); }
.saved-tab.on { background: rgba(251,191,36,.12); color: #fbbf24; border-color: rgba(251,191,36,.25); }

.list { flex: 1; overflow-y: auto; padding: 4px 16px; -webkit-overflow-scrolling: touch; }
.empty { text-align: center; padding: 40px 20px; color: rgba(228,232,241,.3); font-size: 14px; line-height: 1.6; }
.card-wrap { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
.card { display: flex; justify-content: space-between; align-items: center; flex: 1; text-align: left; padding: 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,.05); background: rgba(255,255,255,.03); color: #e4e8f1; cursor: pointer; -webkit-appearance: none; outline: none; min-width: 0; }
.card:active { transform: scale(.98); }
.card.done { background: rgba(0,212,170,.04); border-color: rgba(0,212,170,.1); }
.save-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid rgba(255,255,255,.06); background: rgba(255,255,255,.03); color: rgba(228,232,241,.3); font-size: 16px; cursor: pointer; -webkit-appearance: none; outline: none; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.save-btn.on { background: rgba(251,191,36,.1); border-color: rgba(251,191,36,.2); color: #fbbf24; }
.save-btn:active { transform: scale(.9); }
.card-l { display: flex; align-items: center; gap: 11px; min-width: 0; }
.card-i { width: 36px; height: 36px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; background: rgba(139,92,246,.12); border: 1px solid rgba(139,92,246,.2); color: #a78bfa; }
.card-i.done { background: rgba(0,212,170,.15); border-color: rgba(0,212,170,.25); color: #00d4aa; }
.card-t { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-m { display: flex; gap: 6px; align-items: center; margin-top: 3px; }
.diff { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 7px; white-space: nowrap; }
.card-c { font-size: 11px; color: rgba(228,232,241,.3); }
.xp-tag { font-size: 12px; font-weight: 700; color: #fbbf24; background: rgba(251,191,36,.08); padding: 3px 10px; border-radius: 8px; flex-shrink: 0; white-space: nowrap; }

.toolbar { display: flex; align-items: center; padding: 10px 16px; flex-shrink: 0; border-bottom: 1px solid rgba(255,255,255,.06); gap: 6px; }
.back { background: none; border: none; color: #00d4aa; font-size: 20px; cursor: pointer; padding: 6px; outline: none; -webkit-appearance: none; }
.toolbar-mid { flex: 1; display: flex; align-items: center; min-width: 0; }
.toolbar-t { font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.save-icon { background: none; border: none; font-size: 18px; cursor: pointer; padding: 4px 6px; outline: none; -webkit-appearance: none; color: rgba(228,232,241,.3); }
.save-icon.on { color: #fbbf24; }

.body { flex: 1; overflow-y: auto; padding: 12px 16px; -webkit-overflow-scrolling: touch; }

.lesson-toggle { display: block; width: 100%; text-align: left; padding: 11px 15px; border-radius: 11px; margin-bottom: 8px; background: rgba(99,102,241,.08); border: 1px solid rgba(99,102,241,.15); color: #a5b4fc; font-size: 13px; font-weight: 600; cursor: pointer; -webkit-appearance: none; outline: none; }
.lesson { background: rgba(99,102,241,.05); border: 1px solid rgba(99,102,241,.1); border-radius: 11px; padding: 14px; margin-bottom: 10px; margin-top: -4px; }
.lesson-line { font-size: 13px; line-height: 1.6; color: rgba(228,232,241,.78); margin-bottom: 3px; font-family: ui-monospace, monospace; white-space: pre-wrap; }
.lesson-bullet { font-size: 13px; line-height: 1.55; color: rgba(228,232,241,.72); padding-left: 4px; margin-bottom: 2px; }

.desc { background: rgba(255,255,255,.03); border-radius: 11px; padding: 14px; border: 1px solid rgba(255,255,255,.06); margin-bottom: 10px; }
.desc p { font-size: 14px; line-height: 1.55; color: rgba(228,232,241,.85); }
.expected { display: flex; align-items: center; gap: 8px; margin-top: 10px; background: rgba(0,0,0,.25); padding: 8px 12px; border-radius: 8px; }
.exp-label { font-size: 11px; font-weight: 600; color: rgba(228,232,241,.4); white-space: nowrap; }
.expected code { font-size: 12px; font-family: monospace; color: #00d4aa; }

.editor { border-radius: 11px; overflow: hidden; border: 1px solid rgba(255,255,255,.07); background: #080d18; margin-bottom: 10px; }
.editor-bar { display: flex; align-items: center; gap: 6px; padding: 9px 13px; background: rgba(255,255,255,.02); border-bottom: 1px solid rgba(255,255,255,.05); }
.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.dot.r { background: #ff5f57; } .dot.y { background: #febc2e; } .dot.g { background: #28c840; }
.fname { font-size: 11px; color: rgba(228,232,241,.3); margin-left: 6px; font-family: monospace; }
.editor textarea { width: 100%; min-height: 160px; padding: 13px; background: transparent; color: #e4e8f1; font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.6; border: none; outline: none; resize: vertical; display: block; -webkit-appearance: none; }

.playground-btn {
  display: block; width: 100%; padding: 12px; border-radius: 11px; margin-bottom: 10px;
  background: rgba(0,149,255,.08); border: 1px solid rgba(0,149,255,.18);
  color: #60a5fa; font-size: 14px; font-weight: 600; text-align: center;
  cursor: pointer; -webkit-appearance: none; outline: none;
}
.playground-btn:active { transform: scale(.97); background: rgba(0,149,255,.14); }

.hint-box { background: rgba(251,191,36,.06); border: 1px solid rgba(251,191,36,.12); border-radius: 11px; padding: 13px; margin-bottom: 8px; }
.hint-label { font-size: 12px; font-weight: 700; color: #fbbf24; margin-bottom: 4px; }
.hint-box p { font-size: 13px; line-height: 1.5; color: rgba(228,232,241,.8); }

.ai-box { background: rgba(139,92,246,.06); border: 1px solid rgba(139,92,246,.12); border-radius: 11px; padding: 13px; margin-bottom: 8px; }
.ai-label { font-size: 12px; font-weight: 700; color: #a78bfa; margin-bottom: 4px; }
.ai-box p { font-size: 13px; line-height: 1.5; color: rgba(228,232,241,.8); }
.dim { color: rgba(228,232,241,.4) !important; }

.sol-box { background: rgba(0,212,170,.04); border: 1px solid rgba(0,212,170,.1); border-radius: 11px; padding: 13px; margin-bottom: 8px; }
.sol-label { font-size: 12px; font-weight: 700; color: #00d4aa; margin-bottom: 5px; }
.sol-box code { font-family: monospace; font-size: 13px; color: #e4e8f1; white-space: pre-wrap; line-height: 1.6; display: block; }

.wrong { background: rgba(239,68,68,.07); border: 1px solid rgba(239,68,68,.15); border-radius: 11px; padding: 13px; font-size: 13px; color: #fca5a5; margin-bottom: 8px; }
.success { background: rgba(0,212,170,.07); border: 1px solid rgba(0,212,170,.15); border-radius: 11px; padding: 13px; font-size: 14px; font-weight: 700; color: #00d4aa; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.next-inline { background: rgba(0,212,170,.15); border: 1px solid rgba(0,212,170,.25); color: #00d4aa; padding: 7px 14px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; -webkit-appearance: none; white-space: nowrap; }
.next-inline:active { transform: scale(.95); }

.actions { padding: 8px 16px 10px; flex-shrink: 0; border-top: 1px solid rgba(255,255,255,.05); }
.action-row { display: flex; gap: 6px; margin-bottom: 8px; }
.btn { flex: 1; padding: 11px 4px; border-radius: 11px; font-size: 13px; font-weight: 600; cursor: pointer; outline: none; -webkit-appearance: none; border: 1px solid; }
.btn:active { transform: scale(.96); }
.btn.hint { background: rgba(251,191,36,.07); color: #fbbf24; border-color: rgba(251,191,36,.15); }
.btn.ai { background: rgba(139,92,246,.07); color: #a78bfa; border-color: rgba(139,92,246,.15); }
.btn.sol { background: rgba(255,255,255,.03); color: rgba(228,232,241,.45); border-color: rgba(255,255,255,.06); }
.submit { width: 100%; padding: 15px; border-radius: 13px; font-size: 16px; font-weight: 700; background: linear-gradient(135deg, #00d4aa, #00b894); color: #071a14; border: none; cursor: pointer; outline: none; -webkit-appearance: none; box-shadow: 0 3px 20px rgba(0,212,170,.2); }
.submit:active { transform: scale(.97); }
.submit.nxt { background: linear-gradient(135deg, #8b5cf6, #6d28d9); color: white; box-shadow: 0 3px 20px rgba(139,92,246,.2); }

.nav { display: flex; border-top: 1px solid rgba(255,255,255,.06); flex-shrink: 0; padding-bottom: env(safe-area-inset-bottom); background: #0b1022; }
.nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 10px 0 8px; background: none; border: none; color: rgba(228,232,241,.3); font-size: 10px; font-weight: 600; cursor: pointer; outline: none; -webkit-appearance: none; }
.nav-btn.on { color: #00d4aa; }
.nav-icon { font-size: 20px; }

.fc-header { padding: 18px 20px 8px; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
.fc-count { font-size: 13px; color: rgba(228,232,241,.4); font-weight: 600; }
.fc-area { flex: 1; display: flex; flex-direction: column; padding: 8px 20px 16px; overflow: hidden; }
.fc-card { flex: 1; min-height: 260px; border-radius: 18px; padding: 26px 22px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; cursor: pointer; border: 1px solid rgba(255,255,255,.08); background: linear-gradient(160deg, rgba(255,255,255,.04), rgba(255,255,255,.01)); -webkit-appearance: none; outline: none; color: #e4e8f1; position: relative; width: 100%; }
.fc-card:active { transform: scale(.98); }
.fc-side-label { position: absolute; top: 14px; left: 18px; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: rgba(228,232,241,.2); }
.fc-cat-badge { position: absolute; top: 12px; right: 14px; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 7px; background: rgba(139,92,246,.12); color: #a78bfa; }
.fc-text { font-size: 17px; line-height: 1.6; font-weight: 600; max-width: 300px; }
.fc-answer { font-size: 14px; font-weight: 500; color: rgba(228,232,241,.85); font-family: ui-monospace, monospace; text-align: left; white-space: pre-wrap; }
.fc-tap { position: absolute; bottom: 16px; font-size: 11px; color: rgba(228,232,241,.18); }
.fc-nav { display: flex; gap: 8px; margin-top: 12px; flex-shrink: 0; }
.fc-btn { flex: 1; padding: 13px; border-radius: 11px; font-size: 14px; font-weight: 600; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); color: rgba(228,232,241,.55); cursor: pointer; outline: none; -webkit-appearance: none; }
.fc-btn:active { transform: scale(.96); }

.celeb { position: absolute; inset: 0; z-index: 50; background: rgba(0,0,0,.7); display: flex; align-items: center; justify-content: center; animation: fi .2s; }
.celeb-inner { text-align: center; }
.celeb-emoji { font-size: 60px; animation: pop .4s ease; }
.celeb-t { font-size: 22px; font-weight: 800; color: #00d4aa; margin-top: 8px; }

@keyframes fi { from { opacity: 0 } to { opacity: 1 } }
@keyframes pop { 0% { transform: scale(0) } 50% { transform: scale(1.2) } 100% { transform: scale(1) } }
`;

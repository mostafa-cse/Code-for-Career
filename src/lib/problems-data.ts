export interface ComprehensiveProblem {
  id: string;
  name: string;
  nameBn: string;
  source: string;
  sourceAbbr: string;
  url: string | null;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  company: string | null;
  tags: string[];
  subjectSlug: string;
  subjectName: string;
  appearsIn: { title: string; url: string }[];
  solutionEn: string;
  solutionBn: string;
  timeComplexity: string;
  spaceComplexity: string;
  solutionCode?: string;
}

export const ALL_PROBLEMS: ComprehensiveProblem[] = [
  {
    "id": "cs-boxing-unboxing",
    "name": "Value Types vs Reference Types & Boxing Overhead",
    "nameBn": "\u09ad\u09cd\u09af\u09be\u09b2\u09c1 \u099f\u09be\u0987\u09aa \u09ac\u09a8\u09be\u09ae \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09a8\u09cd\u09b8 \u099f\u09be\u0987\u09aa \u098f\u09ac\u0982 \u09ac\u0995\u09cd\u09b8\u09bf\u0982 \u0993\u09ad\u09be\u09b0\u09b9\u09c7\u09a1",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Brain Station 23",
    "tags": [
      "C#",
      "Memory",
      "CLR Internals",
      "Performance"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "Value vs Reference Types",
        "url": "/subjects/csharp/types-value-types"
      },
      {
        "title": "Boxing & Unboxing Internals",
        "url": "/subjects/csharp/types-boxing"
      }
    ],
    "solutionEn": "Value types live on the stack or inline inside object instances, whereas reference types live on the managed heap. Boxing occurs when a value type is cast to object or an interface, allocating memory on the heap and copying the value. Unboxing extracts the value pointer. Frequent boxing inside loops triggers GC pressure and degrades throughput. Mitigate using generic collections (List<T>) instead of non-generic ArrayList.",
    "solutionBn": "\u09ad\u09cd\u09af\u09be\u09b2\u09c1 \u099f\u09be\u0987\u09aa \u09b8\u09cd\u099f\u09cd\u09af\u09be\u0995 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf\u09a4\u09c7 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09ae\u09be\u09a8 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09c7, \u0986\u09b0 \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09a8\u09cd\u09b8 \u099f\u09be\u0987\u09aa \u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09a1 \u09b9\u09bf\u09aa\u09c7 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c7 \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09a8\u09cd\u09b8 \u09b0\u09be\u0996\u09c7\u0964 \u09af\u0996\u09a8 \u0995\u09cb\u09a8\u09cb \u09ad\u09cd\u09af\u09be\u09b2\u09c1 \u099f\u09be\u0987\u09aa\u0995\u09c7 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09ac\u09be \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8\u09c7 \u0995\u09be\u09b8\u09cd\u099f \u0995\u09b0\u09be \u09b9\u09af\u09bc, \u09a4\u0996\u09a8 \u09b9\u09bf\u09aa\u09c7 \u09a8\u09a4\u09c1\u09a8 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a4\u09c8\u09b0\u09bf \u09b9\u09df\u09c7 \u09ae\u09be\u09a8 \u0995\u09aa\u09bf \u09b9\u09df, \u098f\u0995\u09c7 \u09ac\u0995\u09cd\u09b8\u09bf\u0982 \u09ac\u09b2\u09c7\u0964 \u098f\u099f\u09bf \u0998\u09a8 \u0998\u09a8 \u0998\u099f\u09b2\u09c7 \u0997\u09be\u09b0\u09cd\u09ac\u09c7\u099c \u0995\u09be\u09b2\u09c7\u0995\u09cd\u099f\u09b0\u09c7\u09b0 \u0993\u09aa\u09b0 \u099a\u09be\u09aa \u09aa\u09dc\u09c7\u0964 \u099c\u09c7\u09a8\u09c7\u09b0\u09bf\u0995 \u0995\u09be\u09b2\u09c7\u0995\u09b6\u09a8 (\u09af\u09c7\u09ae\u09a8 List<T>) \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09ac\u0995\u09cd\u09b8\u09bf\u0982 \u098f\u09dc\u09be\u09a8\u09cb \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(1) allocation overhead per box",
    "spaceComplexity": "O(1) heap allocation (24 bytes in 64-bit CLR)",
    "solutionCode": "int num = 42;\nobject boxed = num; // Boxing: 42 is copied onto the heap\nint unboxed = (int)boxed; // Unboxing: value extracted from heap\n\n// Optimization: Use generics to avoid boxing\nList<int> numbers = new List<int>(); // No boxing occurs\nnumbers.Add(num);"
  },
  {
    "id": "cs-idisposable-pattern",
    "name": "Implementing Robust IDisposable & Finalizer Pattern",
    "nameBn": "\u0986\u0987\u09a1\u09bf\u09b8\u09aa\u09cb\u099c\u09c7\u09ac\u09b2 \u098f\u09ac\u0982 \u09ab\u09be\u0987\u09a8\u09be\u09b2\u09be\u0987\u099c\u09be\u09b0 \u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8 \u09ac\u09be\u09b8\u09cd\u09a4\u09ac\u09be\u09df\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Enosis Solutions",
    "tags": [
      "C#",
      "Memory",
      "Garbage Collection",
      "IDisposable"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "IDisposable & using Statement",
        "url": "/subjects/csharp/resources-using"
      },
      {
        "title": "Garbage Collection & Generations",
        "url": "/subjects/csharp/memory-garbage-collection"
      }
    ],
    "solutionEn": "The standard Dispose(bool disposing) pattern releases unmanaged OS handles (file handles, sockets) deterministically. When disposing is true, free managed and unmanaged resources. When disposing is false (called by the GC finalizer), release only unmanaged resources because managed references may have already been collected. Call GC.SuppressFinalize(this) to remove the object from the finalization queue.",
    "solutionBn": "\u0986\u0987\u09a1\u09bf\u09b8\u09aa\u09cb\u099c\u09c7\u09ac\u09b2 \u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8 \u0986\u09a8\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09a1 \u09b0\u09bf\u09b8\u09cb\u09b0\u09cd\u09b8 (\u09af\u09c7\u09ae\u09a8 \u09ab\u09be\u0987\u09b2 \u09b9\u09cd\u09af\u09be\u09a8\u09cd\u09a1\u09c7\u09b2, \u09a1\u09be\u099f\u09be\u09ac\u09c7\u099c \u0995\u09be\u09a8\u09c7\u0995\u09b6\u09a8) \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4\u09ad\u09be\u09ac\u09c7 \u09ae\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09ac\u09cd\u09af\u09ac\u09b9\u09c3\u09a4 \u09b9\u09af\u09bc\u0964 disposing \u099f\u09cd\u09b0\u09c1 \u09b9\u09b2\u09c7 \u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09a1 \u0993 \u0986\u09a8\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09a1 \u0989\u09ad\u09df \u09b0\u09bf\u09b8\u09cb\u09b0\u09cd\u09b8 \u09ae\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u0986\u09b0 \u09af\u09a6\u09bf \u09ab\u09be\u0987\u09a8\u09be\u09b2\u09be\u0987\u099c\u09be\u09b0 \u09a5\u09c7\u0995\u09c7 \u0995\u09b2 \u0986\u09b8\u09c7 (disposing \u09ab\u09b2\u09b8), \u09a4\u09ac\u09c7 \u09b6\u09c1\u09a7\u09c1\u09ae\u09be\u09a4\u09cd\u09b0 \u0986\u09a8\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u099c\u09a1 \u09b0\u09bf\u09b8\u09cb\u09b0\u09cd\u09b8 \u09ae\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be \u09b9\u09df\u0964 GC.SuppressFinalize(this) \u0995\u09b2 \u0995\u09b0\u09c7 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f\u0995\u09c7 \u09ab\u09be\u0987\u09a8\u09be\u09b2\u09be\u0987\u099c\u09c7\u09b6\u09a8 \u0995\u09bf\u0989 \u09a5\u09c7\u0995\u09c7 \u09b8\u09b0\u09bf\u09df\u09c7 \u09aa\u09be\u09b0\u09ab\u09b0\u09ae\u09cd\u09af\u09be\u09a8\u09cd\u09b8 \u09ac\u09c3\u09a6\u09cd\u09a7\u09bf \u0995\u09b0\u09be \u09b9\u09df\u0964",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public class ResourceHolder : IDisposable\n{\n    private bool _disposed = false;\n    private IntPtr _unmanagedHandle;\n\n    public void Dispose()\n    {\n        Dispose(true);\n        GC.SuppressFinalize(this);\n    }\n\n    protected virtual void Dispose(bool disposing)\n    {\n        if (!_disposed)\n        {\n            if (disposing)\n            {\n                // Free managed resources\n            }\n            // Free unmanaged resources\n            _disposed = true;\n        }\n    }\n\n    ~ResourceHolder() => Dispose(false);\n}"
  },
  {
    "id": "cs-linq-deferred-execution",
    "name": "LINQ Deferred Execution vs Immediate Execution",
    "nameBn": "LINQ \u09a1\u09bf\u09ab\u09be\u09b0\u09cd\u09a1 \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u09b6\u09a8 \u09ac\u09a8\u09be\u09ae \u0987\u09ae\u09bf\u09a1\u09bf\u09df\u09c7\u099f \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u09b6\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "Therap (BD)",
    "tags": [
      "C#",
      "LINQ",
      "Yield",
      "Collections"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "LINQ Where & Select",
        "url": "/subjects/csharp/linq-where"
      },
      {
        "title": "Yield Return & Iterators",
        "url": "/subjects/csharp/iterators-yield"
      }
    ],
    "solutionEn": "Deferred execution means the query is not evaluated when defined; instead, it executes each time the sequence is iterated (e.g., via foreach). Methods like Where, Select, and Take yield deferred queries. Operators like ToList(), ToArray(), Count(), and First() trigger immediate evaluation, caching the results in memory. Multiple iterations on a deferred query can result in unintended repeated database queries (N+1 issue).",
    "solutionBn": "\u09a1\u09bf\u09ab\u09be\u09b0\u09cd\u09a1 \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u09b6\u09a8\u09c7\u09b0 \u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0\u09c7 \u0995\u09c1\u09af\u09bc\u09c7\u09b0\u09bf \u0998\u09cb\u09b7\u09a3\u09be\u09b0 \u09b8\u09ae\u09df \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u099f \u09b9\u09af\u09bc \u09a8\u09be; \u09af\u0996\u09a8 \u09b8\u09bf\u0995\u09cb\u09af\u09bc\u09c7\u09a8\u09cd\u09b8\u099f\u09bf \u09b2\u09c1\u09aa\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u098f\u0995\u09cd\u09b8\u09c7\u09b8 \u0995\u09b0\u09be \u09b9\u09af\u09bc \u09a4\u0996\u09a8\u0987 \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u099f \u09b9\u09af\u09bc\u0964 Where, Select \u0987\u09a4\u09cd\u09af\u09be\u09a6\u09bf \u09a1\u09bf\u09ab\u09be\u09b0\u09cd\u09a1 \u0985\u09aa\u09be\u09b0\u09c7\u099f\u09b0\u0964 \u09aa\u0995\u09cd\u09b7\u09be\u09a8\u09cd\u09a4\u09b0\u09c7 ToList(), Count() \u09a4\u09be\u09ce\u0995\u09cd\u09b7\u09a3\u09bf\u0995 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf\u09a4\u09c7 \u09ab\u09b2\u09be\u09ab\u09b2 \u09a8\u09bf\u09df\u09c7 \u0986\u09b8\u09c7\u0964 \u09b8\u09a4\u09b0\u09cd\u0995 \u09a8\u09be \u09a5\u09be\u0995\u09b2\u09c7 \u09a1\u09bf\u09ab\u09be\u09b0\u09cd\u09a1 \u0995\u09c1\u09df\u09c7\u09b0\u09bf\u09b0 \u0995\u09be\u09b0\u09a3\u09c7 \u09a1\u09be\u099f\u09be\u09ac\u09c7\u099c\u09c7 \u098f\u0995\u09be\u09a7\u09bf\u0995 \u0985\u09aa\u09cd\u09b0\u09df\u09cb\u099c\u09a8\u09c0\u09df \u0995\u09c1\u09df\u09c7\u09b0\u09bf \u099a\u09b2\u09c7 \u09af\u09c7\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964",
    "timeComplexity": "O(N) upon iteration",
    "spaceComplexity": "O(1) deferred stream, O(N) when materialized",
    "solutionCode": "var numbers = new List<int> { 1, 2, 3, 4, 5 };\nvar query = numbers.Where(n => n > 2); // Deferred: not evaluated yet\nnumbers.Add(6);\n\n// Evaluates now, includes 6!\nforeach (var n in query) Console.WriteLine(n); \n\nvar list = query.ToList(); // Immediate materialization into memory"
  },
  {
    "id": "cs-string-vs-stringbuilder",
    "name": "String Immutability & StringBuilder Memory Allocation",
    "nameBn": "\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0982 \u0987\u09ae\u09bf\u0989\u099f\u09c7\u09ac\u09bf\u09b2\u09bf\u099f\u09bf \u098f\u09ac\u0982 \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0982\u09ac\u09bf\u09b2\u09cd\u09a1\u09be\u09b0 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u09ac\u09bf\u09b6\u09cd\u09b2\u09c7\u09b7\u09a3",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "BJIT Group",
    "tags": [
      "C#",
      "Strings",
      "Memory",
      "Performance"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "String Immutability & Pool",
        "url": "/subjects/csharp/strings-immutability"
      },
      {
        "title": "StringBuilder Internals",
        "url": "/subjects/csharp/strings-stringbuilder"
      }
    ],
    "solutionEn": "C# strings are immutable; modifying a string creates a brand new string instance on the managed heap and abandons the old one. In a loop of N concatenations, this yields O(N^2) time and allocates N temporary objects for GC. StringBuilder uses a mutable internal character buffer that resizes exponentially, providing amortized O(1) appending and avoiding heap churning.",
    "solutionBn": "C# \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0982 \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u0987\u09ae\u09bf\u0989\u099f\u09c7\u09ac\u09b2; \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0982 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u0995\u09b0\u09a4\u09c7 \u0997\u09c7\u09b2\u09c7\u0987 \u09b9\u09bf\u09aa\u09c7 \u09a8\u09a4\u09c1\u09a8 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a4\u09c8\u09b0\u09bf \u09b9\u09df\u0964 \u09b2\u09c1\u09aa\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b8\u09be\u09a7\u09be\u09b0\u09a3 + \u09a6\u09bf\u09df\u09c7 \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0982 \u09af\u09cb\u0997 \u0995\u09b0\u09b2\u09c7 O(N^2) \u09b8\u09ae\u09df \u0993 \u09ac\u09bf\u09aa\u09c1\u09b2 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u0985\u09aa\u099a\u09df \u09b9\u09df\u0964 StringBuilder \u098f\u0995\u099f\u09bf \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09a8\u09be\u09b2 \u0995\u09cd\u09af\u09be\u09b0\u09c7\u0995\u09cd\u099f\u09be\u09b0 \u09ac\u09be\u09ab\u09be\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 \u09af\u09be\u09b0 \u09ab\u09b2\u09c7 \u09a8\u09a4\u09c1\u09a8 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u09ac\u09b0\u09be\u09a6\u09cd\u09a6 \u099b\u09be\u09dc\u09be\u0987 O(1) \u09b8\u09ae\u09df\u09c7 \u099f\u09c7\u0995\u09cd\u09b8\u099f \u0985\u09cd\u09af\u09be\u09aa\u09c7\u09a8\u09cd\u09a1 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(N) with StringBuilder vs O(N^2) with string +",
    "spaceComplexity": "O(N) buffer allocation",
    "solutionCode": "var sb = new StringBuilder(1024);\nfor (int i = 0; i < 1000; i++)\n{\n    sb.Append(i).Append(\",\");\n}\nstring result = sb.ToString();"
  },
  {
    "id": "cs-async-await-internals",
    "name": "Async/Await State Machine & ConfigureAwait(false)",
    "nameBn": "\u0985\u09cd\u09af\u09be\u09b8\u09bf\u0999\u09cd\u0995/\u0985\u09cd\u09af\u09be\u0993\u09af\u09bc\u09c7\u099f \u09b8\u09cd\u099f\u09c7\u099f \u09ae\u09c7\u09b6\u09bf\u09a8 \u098f\u09ac\u0982 \u0995\u09a8\u09ab\u09bf\u0997\u09be\u09b0\u0985\u09cd\u09af\u09be\u0993\u09af\u09bc\u09c7\u099f",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "C#",
      "Async",
      "Threading",
      "CLR"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "Async/Await & Task",
        "url": "/subjects/csharp/async-task"
      },
      {
        "title": "Concurrency & Synchronization",
        "url": "/subjects/csharp/async-sync-vs-async"
      }
    ],
    "solutionEn": "The C# compiler converts async methods into an IAsyncStateMachine struct that handles suspension points without blocking OS threads. When an await occurs on an incomplete task, the method registers a continuation and returns an incomplete Task. ConfigureAwait(false) tells the runtime that the continuation does not need to resume on the original captured SynchronizationContext, preventing UI thread deadlocks and improving backend server throughput.",
    "solutionBn": "C# \u0995\u09ae\u09cd\u09aa\u09be\u0987\u09b2\u09be\u09b0 async \u09ae\u09c7\u09a5\u09a1\u0995\u09c7 \u098f\u0995\u099f\u09bf \u09b8\u09cd\u099f\u09c7\u099f \u09ae\u09c7\u09b6\u09bf\u09a8 \u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u099a\u09be\u09b0\u09c7 \u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0 \u0995\u09b0\u09c7\u0964 await \u09aa\u09be\u0993\u09df\u09be\u09b0 \u09aa\u09b0 \u099f\u09be\u09b8\u09cd\u0995 \u0985\u09b8\u09ae\u09be\u09aa\u09cd\u09a4 \u09a5\u09be\u0995\u09b2\u09c7 \u09a5\u09cd\u09b0\u09c7\u09a1 \u09ac\u09cd\u09b2\u0995 \u09a8\u09be \u0995\u09b0\u09c7 \u09ae\u09c7\u09a5\u09a1\u099f\u09bf \u09b0\u09bf\u099f\u09be\u09b0\u09cd\u09a8 \u0995\u09b0\u09c7 \u09a6\u09c7\u09df\u0964 ConfigureAwait(false) \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09b2\u09c7 \u0986\u0997\u09c7\u09b0 \u09a5\u09cd\u09b0\u09c7\u09a1 \u09ac\u09be \u09b8\u09bf\u09a8\u0995\u09cd\u09b0\u09cb\u09a8\u09be\u0987\u099c\u09c7\u09b6\u09a8 \u0995\u09a8\u099f\u09c7\u0995\u09cd\u09b8\u099f\u09c7 \u09ab\u09bf\u09b0\u09c7 \u09af\u09be\u0993\u09df\u09be\u09b0 \u09ac\u09be\u09a7\u09cd\u09af\u09ac\u09be\u09a7\u0995\u09a4\u09be \u09a5\u09be\u0995\u09c7 \u09a8\u09be, \u09af\u09be \u09ac\u09cd\u09af\u09be\u0995\u098f\u09a8\u09cd\u09a1 \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0\u09c7\u09b0 \u09a5\u09cd\u09b0\u09c1\u09aa\u09c1\u099f \u09ac\u09be\u09dc\u09be\u09df \u098f\u09ac\u0982 \u09a1\u09c7\u09a1\u09b2\u0995 \u09aa\u09cd\u09b0\u09a4\u09bf\u09b0\u09cb\u09a7 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(1) dispatch overhead",
    "spaceComplexity": "O(1) state machine allocation",
    "solutionCode": "public async Task<string> FetchDataAsync(HttpClient client, string url)\n{\n    var response = await client.GetAsync(url).ConfigureAwait(false);\n    response.EnsureSuccessStatusCode();\n    return await response.Content.ReadAsStringAsync().ConfigureAwait(false);\n}"
  },
  {
    "id": "git-merge-vs-rebase",
    "name": "Git Merge vs Rebase: Commit History & Conflicts",
    "nameBn": "\u0997\u09bf\u099f \u09ae\u09be\u09b0\u09cd\u099c \u09ac\u09a8\u09be\u09ae \u09b0\u09bf\u09ac\u09cd\u09af\u09be\u09b8: \u09b9\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf \u0993 \u0995\u09a8\u09ab\u09cd\u09b2\u09bf\u0995\u09cd\u099f \u09b8\u09ae\u09be\u09a7\u09be\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Cefalo",
    "tags": [
      "Git",
      "VCS",
      "Workflow",
      "Branching"
    ],
    "subjectSlug": "git",
    "subjectName": "Git & Version Control",
    "appearsIn": [
      {
        "title": "Merge vs Rebase Best Practices",
        "url": "/subjects/csharp"
      }
    ],
    "solutionEn": "git merge preserves the exact chronological history and records an explicit merge commit with two parents. git rebase rewrites project history by taking commits from the current branch and reapplying them one by one on top of the target base branch, yielding a linear, clean history. Golden rule: Never rebase commits that have been pushed to a public/shared branch.",
    "solutionBn": "git merge \u09ac\u09cd\u09b0\u09be\u099e\u09cd\u099a\u09c7\u09b0 \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u0985\u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09bf\u09a4 \u0987\u09a4\u09bf\u09b9\u09be\u09b8 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09c7 \u098f\u09ac\u0982 \u098f\u0995\u099f\u09bf \u09ae\u09be\u09b0\u09cd\u099c \u0995\u09ae\u09bf\u099f \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c7\u0964 \u0985\u09a8\u09cd\u09af\u09a6\u09bf\u0995\u09c7 git rebase \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09ac\u09cd\u09b0\u09be\u099e\u09cd\u099a\u09c7\u09b0 \u0995\u09ae\u09bf\u099f\u0997\u09c1\u09b2\u09cb\u0995\u09c7 \u09a8\u09a4\u09c1\u09a8 \u09ac\u09c7\u09b8\u09c7\u09b0 \u0993\u09aa\u09b0 \u098f\u0995\u09c7 \u098f\u0995\u09c7 \u09aa\u09c1\u09a8\u09b0\u09be\u09df \u09aa\u09cd\u09b0\u09df\u09cb\u0997 \u0995\u09b0\u09c7 \u098f\u0995\u099f\u09bf \u09b8\u09b0\u09b2\u09b0\u09c8\u0996\u09bf\u0995 \u09b8\u09c1\u09a8\u09cd\u09a6\u09b0 \u09b9\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c7\u0964 \u09a4\u09ac\u09c7 \u09aa\u09be\u09ac\u09b2\u09bf\u0995 \u09ac\u09cd\u09b0\u09be\u099e\u09cd\u099a\u09c7 \u0995\u0996\u09a8\u09cb \u09b0\u09bf\u09ac\u09cd\u09af\u09be\u09b8 \u0995\u09b0\u09be \u0989\u099a\u09bf\u09a4 \u09a8\u09df \u0995\u09be\u09b0\u09a3 \u098f\u099f\u09bf \u09b9\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf \u09aa\u09c1\u09a8\u09b0\u09cd\u09b2\u09bf\u0996\u09a8 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(C) where C is commit count",
    "spaceComplexity": "O(1)",
    "solutionCode": "# Linear feature branch update:\ngit checkout feature\ngit fetch origin\ngit rebase origin/main\n# If conflict occurs: fix, then git rebase --continue"
  },
  {
    "id": "git-cherry-pick-revert",
    "name": "Cherry-Pick Specific Commits & Safe Revert in Production",
    "nameBn": "\u099a\u09c7\u09b0\u09bf-\u09aa\u09bf\u0995 \u0993 \u09aa\u09cd\u09b0\u09cb\u09a1\u09be\u0995\u09b6\u09a8\u09c7 \u09a8\u09bf\u09b0\u09be\u09aa\u09a6 \u09b0\u09bf\u09ad\u09be\u09b0\u09cd\u099f \u0995\u09cc\u09b6\u09b2",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "Therap (BD)",
    "tags": [
      "Git",
      "Hotfix",
      "Production",
      "VCS"
    ],
    "subjectSlug": "git",
    "subjectName": "Git & Version Control",
    "appearsIn": [
      {
        "title": "Git Flow & Pull Requests",
        "url": "/subjects/csharp"
      }
    ],
    "solutionEn": "git cherry-pick <commit-hash> applies the exact diff from an existing commit onto your current HEAD, commonly used to port emergency hotfixes between release branches. git revert creates a brand new commit that inversely undoes the specified commit's changes without erasing history, making it completely safe for shared branches unlike git reset --hard.",
    "solutionBn": "git cherry-pick \u09a6\u09bf\u09df\u09c7 \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u098f\u0995\u099f\u09bf \u0995\u09ae\u09bf\u099f\u09c7\u09b0 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09ac\u09cd\u09b0\u09be\u099e\u09cd\u099a\u09c7 \u09a8\u09bf\u09df\u09c7 \u0986\u09b8\u09be \u09af\u09be\u09df (\u09b9\u099f\u09ab\u09bf\u0995\u09cd\u09b8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09aa\u09cd\u09b0\u09af\u09cb\u099c\u09cd\u09af)\u0964 git revert \u09b9\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf \u09a8\u09be \u09ae\u09c1\u099b\u09c7 \u0989\u09b2\u09cd\u099f\u09cb \u098f\u0995\u099f\u09bf \u09a8\u09a4\u09c1\u09a8 \u0995\u09ae\u09bf\u099f \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c7 \u09aa\u09c2\u09b0\u09cd\u09ac\u09c7\u09b0 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u09ac\u09be\u09a4\u09bf\u09b2 \u0995\u09b0\u09c7, \u09ab\u09b2\u09c7 \u09aa\u09cd\u09b0\u09cb\u09a1\u09be\u0995\u09b6\u09a8 \u0993 \u099f\u09bf\u09ae \u09aa\u09cd\u09b0\u099c\u09c7\u0995\u09cd\u099f\u09c7 \u098f\u099f\u09bf \u09a8\u09bf\u09b0\u09be\u09aa\u09a6\u0964",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "solutionCode": "# Apply critical hotfix to release branch:\ngit checkout release/v1.2\ngit cherry-pick a1b2c3d\n\n# Safe production rollback:\ngit revert HEAD --no-edit\ngit push origin release/v1.2"
  },
  {
    "id": "oop-solid-dip-ioc",
    "name": "Dependency Inversion Principle (DIP) & IoC Containers",
    "nameBn": "\u09a1\u09bf\u09aa\u09c7\u09a8\u09cd\u09a1\u09c7\u09a8\u09cd\u09b8\u09bf \u0987\u09a8\u09ad\u09be\u09b0\u09cd\u09b8\u09a8 \u09aa\u09cd\u09b0\u09bf\u09a8\u09cd\u09b8\u09bf\u09aa\u09be\u09b2 (DIP) \u0993 IoC \u0995\u09a8\u099f\u09c7\u0987\u09a8\u09be\u09b0",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "OOP",
      "SOLID",
      "Clean Architecture",
      "C#"
    ],
    "subjectSlug": "oop",
    "subjectName": "OOP in C#",
    "appearsIn": [
      {
        "title": "SOLID Principles in Depth",
        "url": "/subjects/oop/solid-principles-overview"
      },
      {
        "title": "Dependency Injection Lifetimes",
        "url": "/subjects/dotnet"
      }
    ],
    "solutionEn": "High-level modules should not depend on low-level modules; both should depend on abstractions. Inversion of Control (IoC) delegates object instantiation to a container (like Microsoft.Extensions.DependencyInjection). Constructor injection ensures classes declare their dependencies explicitly, decoupling business logic from concrete third-party services and enabling unit testing via mocks.",
    "solutionBn": "\u0989\u099a\u09cd\u099a\u09b8\u09cd\u09a4\u09b0\u09c7\u09b0 \u09ae\u09a1\u09bf\u0989\u09b2 \u0995\u0996\u09a8\u09cb\u0987 \u09a8\u09bf\u09ae\u09cd\u09a8\u09b8\u09cd\u09a4\u09b0\u09c7\u09b0 \u09ae\u09a1\u09bf\u0989\u09b2\u09c7\u09b0 \u0993\u09aa\u09b0 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09a8\u09bf\u09b0\u09cd\u09ad\u09b0 \u0995\u09b0\u09ac\u09c7 \u09a8\u09be; \u0989\u09ad\u09df\u09c7\u0987 \u0985\u09cd\u09af\u09be\u09ac\u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u09b6\u09a8\u09c7\u09b0 (\u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8) \u0993\u09aa\u09b0 \u09a8\u09bf\u09b0\u09cd\u09ad\u09b0 \u0995\u09b0\u09ac\u09c7\u0964 IoC \u0995\u09a8\u099f\u09c7\u0987\u09a8\u09be\u09b0 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a4\u09c8\u09b0\u09bf\u09b0 \u09a6\u09be\u09df\u09bf\u09a4\u09cd\u09ac \u09a8\u09bf\u099c\u09c7\u09b0 \u09b9\u09be\u09a4\u09c7 \u09a8\u09c7\u09df\u0964 \u0995\u09a8\u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u09cd\u099f\u09b0 \u0987\u09a8\u099c\u09c7\u0995\u09b6\u09a8\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09a1\u09bf\u09aa\u09c7\u09a8\u09cd\u09a1\u09c7\u09a8\u09cd\u09b8\u09bf \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8 \u09aa\u09be\u09b8 \u0995\u09b0\u09b2\u09c7 \u0995\u09cb\u09a1 \u09b8\u09b9\u099c\u09c7 \u099f\u09c7\u09b8\u09cd\u099f \u0993 \u09ae\u0995 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(1) resolution via reflection/compiled expressions",
    "spaceComplexity": "O(1)",
    "solutionCode": "public interface INotificationService { Task SendAsync(string msg); }\n\npublic class OrderProcessor\n{\n    private readonly INotificationService _notifier;\n    public OrderProcessor(INotificationService notifier) => _notifier = notifier;\n    public async Task ProcessOrder() => await _notifier.SendAsync(\"Order Completed\");\n}"
  },
  {
    "id": "oop-diamond-problem-interfaces",
    "name": "Multiple Inheritance, The Diamond Problem & Default Interface Methods",
    "nameBn": "\u09ae\u09be\u09b2\u09cd\u099f\u09bf\u09aa\u09b2 \u0987\u09a8\u09b9\u09c7\u09b0\u09bf\u099f\u09c7\u09a8\u09cd\u09b8, \u09a1\u09be\u09df\u09ae\u09a8\u09cd\u09a1 \u09aa\u09cd\u09b0\u09ac\u09b2\u09c7\u09ae \u0993 \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8 \u09ae\u09c7\u09a5\u09a1",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "OOP",
      "Inheritance",
      "C# 8.0+",
      "Polymorphism"
    ],
    "subjectSlug": "oop",
    "subjectName": "OOP in C#",
    "appearsIn": [
      {
        "title": "Inheritance vs Composition",
        "url": "/subjects/oop"
      },
      {
        "title": "Interfaces vs Abstract Classes",
        "url": "/subjects/oop"
      }
    ],
    "solutionEn": "C# forbids multiple class inheritance to avoid the Diamond Problem (ambiguity regarding which parent implementation is invoked). C# allows a class to implement multiple interfaces. In C# 8+, interfaces support default implementations; if an ambiguity arises between two interfaces providing the same default method, the implementing class must explicitly implement or disambiguate the method call.",
    "solutionBn": "C# \u0995\u09cd\u09b2\u09be\u09b8\u09c7\u09b0 \u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0\u09c7 \u09ae\u09be\u09b2\u09cd\u099f\u09bf\u09aa\u09b2 \u0987\u09a8\u09b9\u09c7\u09b0\u09bf\u099f\u09c7\u09a8\u09cd\u09b8 \u09b8\u09ae\u09b0\u09cd\u09a5\u09a8 \u0995\u09b0\u09c7 \u09a8\u09be \u09af\u09be\u09a4\u09c7 \u09a1\u09be\u09df\u09ae\u09a8\u09cd\u09a1 \u09aa\u09cd\u09b0\u09ac\u09b2\u09c7\u09ae (\u0995\u09cb\u09a8 \u09aa\u09cd\u09af\u09be\u09b0\u09c7\u09a8\u09cd\u099f\u09c7\u09b0 \u09ae\u09c7\u09a5\u09a1 \u099a\u09b2\u09ac\u09c7 \u09a4\u09be \u09a8\u09bf\u09df\u09c7 \u0985\u09b8\u09cd\u09aa\u09b7\u09cd\u099f\u09a4\u09be) \u09a8\u09be \u0998\u099f\u09c7\u0964 \u09a4\u09ac\u09c7 \u098f\u0995\u099f\u09bf \u0995\u09cd\u09b2\u09be\u09b8 \u098f\u0995\u09be\u09a7\u09bf\u0995 \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8 \u0987\u09ae\u09aa\u09cd\u09b2\u09bf\u09ae\u09c7\u09a8\u09cd\u099f \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964 C# 8 \u098f \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8\u09c7 \u09a1\u09bf\u09ab\u09b2\u09cd\u099f \u09ae\u09c7\u09a5\u09a1 \u09af\u09cb\u0997 \u0995\u09b0\u09be \u09b9\u09df\u09c7\u099b\u09c7; \u098f\u0995\u0987 \u09a8\u09be\u09ae\u09c7\u09b0 \u09ae\u09c7\u09a5\u09a1 \u09a6\u09c1\u099f\u09bf \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8\u09c7 \u09a5\u09be\u0995\u09b2\u09c7 \u0995\u09cd\u09b2\u09be\u09b8\u0995\u09c7 \u0985\u09ac\u09b6\u09cd\u09af\u0987 \u098f\u0995\u09cd\u09b8\u09aa\u09cd\u09b2\u09bf\u09b8\u09bf\u099f \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8 \u0987\u09ae\u09aa\u09cd\u09b2\u09bf\u09ae\u09c7\u09a8\u09cd\u099f\u09c7\u09b6\u09a8\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u0995\u09b0\u09a4\u09c7 \u09b9\u09df\u0964",
    "timeComplexity": "O(1) vtable lookup",
    "spaceComplexity": "O(1)",
    "solutionCode": "public interface ILogger { void Log() => Console.WriteLine(\"Default Logger\"); }\npublic interface IWriter { void Log() => Console.WriteLine(\"Default Writer\"); }\n\npublic class Service : ILogger, IWriter\n{\n    // Disambiguate explicitly:\n    void ILogger.Log() => Console.WriteLine(\"Service Logger\");\n    void IWriter.Log() => Console.WriteLine(\"Service Writer\");\n}"
  },
  {
    "id": "oop-liskov-substitution",
    "name": "Liskov Substitution Principle (LSP): Rectangle & Square Fallacy",
    "nameBn": "\u09b2\u09bf\u09b8\u0995\u09ad \u09b8\u09be\u09ac\u09b8\u09cd\u099f\u09bf\u099f\u09bf\u0989\u09b6\u09a8 \u09aa\u09cd\u09b0\u09bf\u09a8\u09cd\u09b8\u09bf\u09aa\u09be\u09b2 (LSP): \u0986\u09af\u09bc\u09a4\u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0 \u0993 \u09ac\u09b0\u09cd\u0997\u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0\u09c7\u09b0 \u09ac\u09bf\u09ad\u09cd\u09b0\u09be\u09a8\u09cd\u09a4\u09bf",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Therap (BD)",
    "tags": [
      "OOP",
      "SOLID",
      "Architecture",
      "Design"
    ],
    "subjectSlug": "oop",
    "subjectName": "OOP in C#",
    "appearsIn": [
      {
        "title": "SOLID Principles in Depth",
        "url": "/subjects/oop/solid-principles-overview"
      }
    ],
    "solutionEn": "LSP states that subtypes must be substitutable for their base types without altering program correctness. Modeling Square as a subclass of Rectangle violates LSP because setting width and height independently in a Square mutates both dimensions, violating client invariants expecting Area = Width * Height with independent setters. The solution is creating a shared Shape interface with an Area getter, or keeping them separate.",
    "solutionBn": "\u09b2\u09bf\u09b8\u0995\u09ad \u09b8\u09be\u09ac\u09b8\u09cd\u099f\u09bf\u099f\u09bf\u0989\u09b6\u09a8 \u09ac\u09b2\u09c7 \u09af\u09c7 \u0995\u09cb\u09a8\u09cb \u09ac\u09c7\u09b8 \u0995\u09cd\u09b2\u09be\u09b8\u09c7\u09b0 \u099c\u09be\u09df\u0997\u09be\u09df \u09a4\u09be\u09b0 \u099a\u09be\u0987\u09b2\u09cd\u09a1 \u0995\u09cd\u09b2\u09be\u09b8 \u09ac\u09b8\u09be\u09b2\u09c7 \u09aa\u09cd\u09b0\u09cb\u0997\u09cd\u09b0\u09be\u09ae\u09c7\u09b0 \u0986\u099a\u09b0\u09a3 \u09ad\u09c1\u09b2 \u09b9\u0993\u09df\u09be \u099a\u09b2\u09ac\u09c7 \u09a8\u09be\u0964 \u0997\u09a3\u09bf\u09a4\u09c7 \u09ac\u09b0\u09cd\u0997\u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0 \u098f\u0995\u099f\u09bf \u0986\u09df\u09a4\u0995\u09cd\u09b7\u09c7\u09a4\u09cd\u09b0 \u09b9\u09b2\u09c7\u0993 \u0993\u0993\u09aa\u09bf\u09a4\u09c7 Rectangle \u09a5\u09c7\u0995\u09c7 Square \u0987\u09a8\u09b9\u09c7\u09b0\u09bf\u099f \u0995\u09b0\u09b2\u09c7 \u09aa\u09cd\u09b0\u09b8\u09cd\u09a5 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u0995\u09b0\u09b2\u09c7 \u0989\u099a\u09cd\u099a\u09a4\u09be\u0993 \u09ac\u09a6\u09b2\u09c7 \u09af\u09be\u09df, \u09af\u09be \u09ac\u09c7\u09b8 \u0995\u09cd\u09b2\u09be\u09b8\u09c7\u09b0 \u09a8\u09bf\u09df\u09ae \u09ad\u0999\u09cd\u0997 \u0995\u09b0\u09c7\u0964 \u09b8\u09a0\u09bf\u0995 \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u09b9\u09b2\u09cb \u0995\u09ae\u09a8 Shape \u0987\u09a8\u09cd\u099f\u09be\u09b0\u09ab\u09c7\u09b8 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be\u0964",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public interface IShape { double CalculateArea(); }\n\npublic class Rectangle : IShape\n{\n    public double Width { get; set; }\n    public double Height { get; set; }\n    public double CalculateArea() => Width * Height;\n}\n\npublic class Square : IShape\n{\n    public double Side { get; set; }\n    public double CalculateArea() => Side * Side;\n}"
  },
  {
    "id": "dsa-two-sum",
    "name": "Two Sum",
    "nameBn": "\u099f\u09c1 \u09b8\u09be\u09ae",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/two-sum/",
    "difficulty": "EASY",
    "company": "Samsung R&D",
    "tags": [
      "Array",
      "Hash Table",
      "Search"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Hash Tables & Dictionary Internals",
        "url": "/subjects/csharp/collections-dictionary"
      },
      {
        "title": "Asymptotic Complexity (Big-O)",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Use a hash map to store each number and its index. For each element num at index i, compute complement = target - num. If complement exists in the hash map, return [map[complement], i]. This achieves single-pass O(N) time complexity and O(N) space.",
    "solutionBn": "\u098f\u0995\u099f\u09bf \u09b9\u09cd\u09af\u09be\u09b6\u09ae\u09cd\u09af\u09be\u09aa\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09b8\u0982\u0996\u09cd\u09af\u09be \u098f\u09ac\u0982 \u09a4\u09be\u09b0 \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09c1\u09a8\u0964 \u09b2\u09c1\u09aa\u09c7 \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09b8\u0982\u0996\u09cd\u09af\u09be num \u098f\u09b0 \u099c\u09a8\u09cd\u09af complement = target - num \u09ac\u09c7\u09b0 \u0995\u09b0\u09c1\u09a8\u0964 \u09af\u09a6\u09bf \u09b9\u09cd\u09af\u09be\u09b6\u09ae\u09cd\u09af\u09be\u09aa\u09c7 complement \u0986\u0997\u09c7 \u09a5\u09c7\u0995\u09c7\u0987 \u09a5\u09be\u0995\u09c7, \u09a4\u09ac\u09c7 \u0989\u09ad\u09df\u09c7\u09b0 \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8 \u099c\u09cb\u09dc\u09be \u09b0\u09bf\u099f\u09be\u09b0\u09cd\u09a8 \u0995\u09b0\u09c1\u09a8\u0964 \u098f\u099f\u09bf \u09ae\u09be\u09a4\u09cd\u09b0 \u098f\u0995\u09ac\u09be\u09b0 \u09b2\u09c1\u09aa \u099a\u09be\u09b2\u09bf\u09df\u09c7 O(N) \u09b8\u09ae\u09df\u09c7 \u0995\u09be\u099c \u09b6\u09c7\u09b7 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "solutionCode": "public int[] TwoSum(int[] nums, int target)\n{\n    var map = new Dictionary<int, int>();\n    for (int i = 0; i < nums.Length; i++)\n    {\n        int complement = target - nums[i];\n        if (map.TryGetValue(complement, out int index))\n            return new int[] { index, i };\n        map[nums[i]] = i;\n    }\n    return Array.Empty<int>();\n}"
  },
  {
    "id": "dsa-lru-cache",
    "name": "LRU Cache Design with Doubly Linked List & Hash Map",
    "nameBn": "\u098f\u09b2\u0986\u09b0\u0987\u0989 \u0995\u09cd\u09af\u09be\u09b6 \u09a1\u09bf\u099c\u09be\u0987\u09a8 (\u09a1\u09be\u09ac\u09b2\u09bf \u09b2\u09bf\u0999\u09cd\u0995\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f \u0993 \u09b9\u09cd\u09af\u09be\u09b6 \u09ae\u09cd\u09af\u09be\u09aa)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/lru-cache/",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Design",
      "Hash Table",
      "Linked List",
      "Data Structures"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Data Structures & Complexity",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Combine a Doubly Linked List (DLL) and a Hash Map. The Hash Map stores key -> DLL Node for O(1) lookups. The DLL maintains access recency: newly accessed nodes are moved to the head, and the least recently used node resides at the tail. When capacity overflows, evict the tail node and remove its entry from the map.",
    "solutionBn": "\u09a1\u09be\u09ac\u09b2\u09bf \u09b2\u09bf\u0999\u09cd\u0995\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f \u098f\u09ac\u0982 \u09b9\u09cd\u09af\u09be\u09b6\u09ae\u09cd\u09af\u09be\u09aa\u09c7\u09b0 \u09b8\u09ae\u09a8\u09cd\u09ac\u09df\u09c7 \u098f\u09b2\u0986\u09b0\u0987\u0989 \u0995\u09cd\u09af\u09be\u09b6 \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09be \u09b9\u09df\u0964 \u09b9\u09cd\u09af\u09be\u09b6\u09ae\u09cd\u09af\u09be\u09aa O(1) \u09b8\u09ae\u09df\u09c7 \u09af\u09c7\u0995\u09cb\u09a8\u09cb \u0995\u09c0 \u0996\u09c1\u0981\u099c\u09c7 \u09a6\u09c7\u09df\u0964 \u0986\u09b0 \u09b2\u09bf\u0999\u09cd\u0995\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u09c7\u09b0 \u09b8\u09ae\u09df\u0995\u09cd\u09b0\u09ae \u09a7\u09b0\u09c7 \u09b0\u09be\u0996\u09c7\u2014\u09af\u09c7\u0995\u09cb\u09a8\u09cb \u098f\u09b2\u09bf\u09ae\u09c7\u09a8\u09cd\u099f \u09b0\u09bf\u09a1 \u09ac\u09be \u09b0\u09be\u0987\u099f \u09b9\u09b2\u09c7 \u09a4\u09be\u0995\u09c7 \u09b9\u09c7\u09a1 \u098f \u0986\u09a8\u09be \u09b9\u09df, \u098f\u09ac\u0982 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u09aa\u09c2\u09b0\u09cd\u09a3 \u09b9\u09b2\u09c7 \u099f\u09c7\u0987\u09b2 \u09a8\u09cb\u09a1\u099f\u09bf \u09b8\u09b0\u09bf\u09df\u09c7 \u09a6\u09c7\u0993\u09df\u09be \u09b9\u09df\u0964",
    "timeComplexity": "O(1) Get and Put",
    "spaceComplexity": "O(Capacity)",
    "solutionCode": "public class LRUCache\n{\n    private class Node { public int Key, Val; public Node Prev, Next; }\n    private readonly int _cap;\n    private readonly Dictionary<int, Node> _map = new();\n    private readonly Node _head = new(), _tail = new();\n\n    public LRUCache(int capacity)\n    {\n        _cap = capacity;\n        _head.Next = _tail; _tail.Prev = _head;\n    }\n    // O(1) operations moving accessed nodes to _head.Next\n}"
  },
  {
    "id": "dsa-merge-k-sorted-lists",
    "name": "Merge k Sorted Lists using Min-Heap Priority Queue",
    "nameBn": "\u09ae\u09bf\u09a8-\u09b9\u09bf\u09aa \u09aa\u09cd\u09b0\u09be\u09df\u09cb\u09b0\u09bf\u099f\u09bf \u0995\u09bf\u0989 \u09a6\u09bf\u09df\u09c7 k-\u099f\u09bf \u09b8\u09b0\u09cd\u099f\u09c7\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f \u09ae\u09be\u09b0\u09cd\u099c",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/merge-k-sorted-lists/",
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "Linked List",
      "Heap",
      "Priority Queue",
      "Divide and Conquer"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Standard Algorithmic Techniques",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Initialize a min-priority queue with the head node of each of the k lists. Repeatedly pop the minimum node, append it to the merged output list, and if that node has a next pointer, push node.next into the priority queue. Total time complexity is O(N log k) where N is the total number of nodes across all lists.",
    "solutionBn": "k-\u099f\u09bf \u09b2\u09bf\u09b8\u09cd\u099f\u09c7\u09b0 \u09aa\u09cd\u09b0\u09a5\u09ae \u09a8\u09cb\u09a1\u0997\u09c1\u09b2\u09cb\u0995\u09c7 \u098f\u0995\u099f\u09bf \u09ae\u09bf\u09a8-\u09b9\u09bf\u09aa \u09aa\u09cd\u09b0\u09be\u09df\u09cb\u09b0\u09bf\u099f\u09bf \u0995\u09bf\u0989\u09a4\u09c7 \u09b0\u09be\u0996\u09c1\u09a8\u0964 \u0995\u09bf\u0989 \u09a5\u09c7\u0995\u09c7 \u0995\u09cd\u09b7\u09c1\u09a6\u09cd\u09b0\u09a4\u09ae \u09a8\u09cb\u09a1\u099f\u09bf \u09a4\u09c1\u09b2\u09c7 \u09ae\u09be\u09b0\u09cd\u099c\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f\u09c7 \u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8 \u098f\u09ac\u0982 \u09a4\u09be\u09b0 \u09aa\u09b0\u09ac\u09b0\u09cd\u09a4\u09c0 \u09a8\u09cb\u09a1\u099f\u09bf \u0986\u09ac\u09be\u09b0 \u09b9\u09bf\u09aa\u09c7 \u09aa\u09c1\u09b6 \u0995\u09b0\u09c1\u09a8\u0964 \u098f\u09a4\u09c7 \u09ae\u09cb\u099f O(N log k) \u09b8\u09ae\u09df\u09c7 \u09b8\u09ac\u0997\u09c1\u09b2\u09cb \u09b2\u09bf\u09b8\u09cd\u099f \u09a8\u09bf\u0996\u09c1\u0981\u09a4\u09ad\u09be\u09ac\u09c7 \u09ae\u09be\u09b0\u09cd\u099c \u09b9\u09df\u09c7 \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(N log k)",
    "spaceComplexity": "O(k) auxiliary heap space",
    "solutionCode": "public ListNode MergeKLists(ListNode[] lists)\n{\n    var pq = new PriorityQueue<ListNode, int>();\n    foreach (var l in lists) if (l != null) pq.Enqueue(l, l.val);\n    ListNode dummy = new(), curr = dummy;\n    while (pq.Count > 0)\n    {\n        var node = pq.Dequeue();\n        curr.next = node; curr = curr.next;\n        if (node.next != null) pq.Enqueue(node.next, node.next.val);\n    }\n    return dummy.next;\n}"
  },
  {
    "id": "dsa-number-of-islands",
    "name": "Number of Islands (BFS / DFS Connected Components)",
    "nameBn": "\u09a6\u09cd\u09ac\u09c0\u09aa\u09c7\u09b0 \u09b8\u0982\u0996\u09cd\u09af\u09be \u09a8\u09bf\u09b0\u09cd\u09a3\u09af\u09bc (\u0997\u09cd\u09b0\u09be\u09ab \u0995\u09be\u09a8\u09c7\u0995\u09cd\u099f\u09c7\u09a1 \u0995\u09ae\u09cd\u09aa\u09cb\u09a8\u09c7\u09a8\u09cd\u099f BFS / DFS)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/number-of-islands/",
    "difficulty": "MEDIUM",
    "company": "Brain Station 23",
    "tags": [
      "Graph",
      "BFS",
      "DFS",
      "Matrix"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Graph Traversal & BFS/DFS",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Iterate through each cell in the grid. When encountering an unvisited land cell '1', increment the island count and execute BFS or DFS to sink all connected land cells (mutate '1' to '0' or mark in a visited set). Time complexity is O(M * N) since each cell is visited at most once.",
    "solutionBn": "\u0997\u09cd\u09b0\u09bf\u09a1\u09c7\u09b0 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09b8\u09c7\u09b2\u09c7 \u09b2\u09c1\u09aa \u099a\u09be\u09b2\u09be\u09a8\u0964 \u09af\u0996\u09a8\u0987 \u0995\u09cb\u09a8\u09cb '1' \u09aa\u09be\u0993\u09df\u09be \u09af\u09be\u09df, \u09a6\u09cd\u09ac\u09c0\u09aa\u09c7\u09b0 \u09b8\u0982\u0996\u09cd\u09af\u09be \u09e7 \u09ac\u09be\u09dc\u09be\u09a8 \u098f\u09ac\u0982 BFS \u09ac\u09be DFS \u099a\u09be\u09b2\u09bf\u09df\u09c7 \u09a4\u09be\u09b0 \u09b8\u09be\u09a5\u09c7 \u09b8\u0982\u09af\u09c1\u0995\u09cd\u09a4 \u09b8\u09ae\u09b8\u09cd\u09a4 '1' \u0995\u09c7 '0' \u09ac\u09be\u09a8\u09bf\u09df\u09c7 \u09a6\u09bf\u09a8 \u09af\u09be\u09a4\u09c7 \u09aa\u09c1\u09a8\u09b0\u09be\u09df \u0997\u09a3\u09a8\u09be \u09a8\u09be \u09b9\u09df\u0964 \u09b8\u09ae\u09df \u099c\u099f\u09bf\u09b2\u09a4\u09be O(M * N)\u0964",
    "timeComplexity": "O(M * N)",
    "spaceComplexity": "O(M * N) worst case recursion/queue",
    "solutionCode": "public int NumIslands(char[][] grid)\n{\n    int count = 0;\n    for (int r = 0; r < grid.Length; r++)\n        for (int c = 0; c < grid[0].Length; c++)\n            if (grid[r][c] == '1') { count++; Dfs(grid, r, c); }\n    return count;\n}\nvoid Dfs(char[][] g, int r, int c)\n{\n    if (r < 0 || c < 0 || r >= g.Length || c >= g[0].Length || g[r][c] != '1') return;\n    g[r][c] = '0'; // Sink island\n    Dfs(g, r+1, c); Dfs(g, r-1, c); Dfs(g, r, c+1); Dfs(g, r, c-1);\n}"
  },
  {
    "id": "dsa-coin-change",
    "name": "Coin Change (Unbounded Knapsack DP)",
    "nameBn": "\u0995\u09af\u09bc\u09c7\u09a8 \u099a\u09c7\u099e\u09cd\u099c (\u0986\u09a8\u09ac\u09be\u0989\u09a8\u09cd\u09a1\u09c7\u09a1 \u09a8\u09cd\u09af\u09be\u09aa\u09b8\u09cd\u09af\u09be\u0995 \u09a1\u09bf\u09aa\u09bf)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/coin-change/",
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "Dynamic Programming",
      "Knapsack",
      "Optimization"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Dynamic Programming Concepts",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Define dp[i] as the minimum coins needed to form amount i. Initialize dp array with amount + 1, setting dp[0] = 0. For each amount from 1 to target, test each coin c: if i - c >= 0, dp[i] = min(dp[i], 1 + dp[i - c]). Return dp[amount] > amount ? -1 : dp[amount].",
    "solutionBn": "dp[i] \u09b9\u09b2\u09cb i \u09aa\u09b0\u09bf\u09ae\u09be\u09a3 \u099f\u09be\u0995\u09be \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09a4\u09c7 \u09b8\u09b0\u09cd\u09ac\u09a8\u09bf\u09ae\u09cd\u09a8 \u0995\u09df\u09c7\u09a8 \u09b8\u0982\u0996\u09cd\u09af\u09be\u0964 dp[0] = 0 \u098f\u09ac\u0982 \u09ac\u09be\u0995\u09bf\u0997\u09c1\u09b2\u09cb \u0985\u09b8\u09c0\u09ae \u09a6\u09bf\u09df\u09c7 \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09bf\u0964 \u09e7 \u09a5\u09c7\u0995\u09c7 \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09c7 \u09b2\u0995\u09cd\u09b7\u09cd\u09af \u09aa\u09b0\u09bf\u09ae\u09be\u09a3 \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u0995\u09df\u09c7\u09a8 \u099a\u09c7\u0995 \u0995\u09b0\u09c7 dp[i] = min(dp[i], 1 + dp[i - c]) \u09a8\u09bf\u09b0\u09cd\u09a7\u09be\u09b0\u09a3 \u0995\u09b0\u09bf\u0964 \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09be \u09b8\u09ae\u09cd\u09ad\u09ac \u09a8\u09be \u09b9\u09b2\u09c7 -1 \u09b0\u09bf\u099f\u09be\u09b0\u09cd\u09a8 \u0995\u09b0\u09bf\u0964",
    "timeComplexity": "O(Amount * N) where N is number of coins",
    "spaceComplexity": "O(Amount)",
    "solutionCode": "public int CoinChange(int[] coins, int amount)\n{\n    int[] dp = new int[amount + 1];\n    Array.Fill(dp, amount + 1);\n    dp[0] = 0;\n    for (int i = 1; i <= amount; i++)\n        foreach (int c in coins)\n            if (i - c >= 0) dp[i] = Math.Min(dp[i], 1 + dp[i - c]);\n    return dp[amount] > amount ? -1 : dp[amount];\n}"
  },
  {
    "id": "dsa-trapping-rain-water",
    "name": "Trapping Rain Water (Two Pointers)",
    "nameBn": "\u09ac\u09c3\u09b7\u09cd\u099f\u09bf\u09b0 \u09aa\u09be\u09a8\u09bf \u09a7\u09b0\u09c7 \u09b0\u09be\u0996\u09be (\u099f\u09c1 \u09aa\u09af\u09bc\u09c7\u09a8\u09cd\u099f\u09be\u09b0 \u09b8\u09ae\u09be\u09a7\u09be\u09a8)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/trapping-rain-water/",
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "Array",
      "Two Pointers",
      "Monotonic Stack"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Standard Algorithmic Techniques",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Maintain two pointers (left = 0, right = n - 1) and tracking variables leftMax and rightMax. Water trapped at any index depends on min(leftMax, rightMax) - height[i]. Advance the pointer having the smaller max boundary, updating max values and accumulating water. Time: O(N), Space: O(1).",
    "solutionBn": "\u09ac\u09be\u09ae \u0993 \u09a1\u09be\u09a8 \u09a6\u09c1\u0987 \u09aa\u09be\u09b6\u09c7 \u09a6\u09c1\u099f\u09bf \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 (left \u0993 right) \u098f\u09ac\u0982 \u09a4\u09be\u09a6\u09c7\u09b0 \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u0989\u099a\u09cd\u099a\u09a4\u09be (leftMax, rightMax) \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995 \u0995\u09b0\u09c1\u09a8\u0964 \u09af\u09c7 \u09aa\u09be\u09b6\u09c7\u09b0 \u0989\u099a\u09cd\u099a\u09a4\u09be \u0995\u09ae \u09b8\u09c7 \u09aa\u09be\u09b6\u09c7\u09b0 \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 \u098f\u0997\u09bf\u09df\u09c7 \u09a8\u09bf\u09df\u09c7 \u09aa\u09be\u09a8\u09bf \u09b9\u09bf\u09b8\u09be\u09ac \u0995\u09b0\u09c1\u09a8 (water += max - height)\u0964 \u098f\u09a4\u09c7 \u0985\u09a4\u09bf\u09b0\u09bf\u0995\u09cd\u09a4 \u0995\u09cb\u09a8\u09cb \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u099b\u09be\u09dc\u09be\u0987 O(N) \u09b8\u09ae\u09df\u09c7 \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u09b9\u09df\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public int Trap(int[] height)\n{\n    int l = 0, r = height.Length - 1, lMax = 0, rMax = 0, water = 0;\n    while (l < r)\n    {\n        if (height[l] < height[r])\n        {\n            if (height[l] >= lMax) lMax = height[l];\n            else water += lMax - height[l];\n            l++;\n        }\n        else\n        {\n            if (height[r] >= rMax) rMax = height[r];\n            else water += rMax - height[r];\n            r--;\n        }\n    }\n    return water;\n}"
  },
  {
    "id": "cp-segment-tree-point-update",
    "name": "Segment Tree with Point Updates & Range Minimum Queries (RMQ)",
    "nameBn": "\u09b8\u09c7\u0997\u09ae\u09c7\u09a8\u09cd\u099f \u099f\u09cd\u09b0\u09bf: \u09aa\u09df\u09c7\u09a8\u09cd\u099f \u0986\u09aa\u09a1\u09c7\u099f \u0993 \u09b0\u09c7\u099e\u09cd\u099c \u09ae\u09bf\u09a8\u09bf\u09ae\u09be\u09ae \u0995\u09c1\u09df\u09c7\u09b0\u09bf",
    "source": "Codeforces",
    "sourceAbbr": "CF",
    "url": "https://codeforces.com/problemset/problem/339/D",
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "Segment Tree",
      "Range Queries",
      "Trees",
      "Binary Search"
    ],
    "subjectSlug": "competitive-programming",
    "subjectName": "Competitive Programming",
    "appearsIn": [
      {
        "title": "Fast I/O & Segment Trees",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "A binary segment tree stores aggregated answers for intervals. The tree has size 4N. Point update modifies an element and recursively updates ancestor nodes in O(log N). Range query traverses matching canonical interval nodes and combines their results in O(log N).",
    "solutionBn": "\u09b8\u09c7\u0997\u09ae\u09c7\u09a8\u09cd\u099f \u099f\u09cd\u09b0\u09bf \u098f\u0995\u099f\u09bf \u09aa\u09c2\u09b0\u09cd\u09a3\u09be\u0999\u09cd\u0997 \u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u099f\u09cd\u09b0\u09bf \u09af\u09be \u09af\u09c7\u0995\u09cb\u09a8\u09cb \u09b0\u09c7\u099e\u09cd\u099c\u09c7\u09b0 \u09b8\u09ae\u09b7\u09cd\u099f\u09bf \u09ac\u09be \u0995\u09cd\u09b7\u09c1\u09a6\u09cd\u09b0\u09a4\u09ae \u09ae\u09be\u09a8 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09c7\u0964 \u09aa\u09df\u09c7\u09a8\u09cd\u099f \u0986\u09aa\u09a1\u09c7\u099f O(log N) \u09b8\u09ae\u09df\u09c7 \u09aa\u09cd\u09af\u09be\u09b0\u09c7\u09a8\u09cd\u099f \u09a8\u09cb\u09a1\u0997\u09c1\u09b2\u09cb\u0995\u09c7 \u0986\u09aa\u09a1\u09c7\u099f \u0995\u09b0\u09c7 \u098f\u09ac\u0982 \u09b0\u09c7\u099e\u09cd\u099c \u0995\u09c1\u09df\u09c7\u09b0\u09bf O(log N) \u09b8\u09ae\u09df\u09c7 \u0989\u09a4\u09cd\u09a4\u09b0 \u09a6\u09bf\u09df\u09c7 \u09a6\u09c7\u09df\u0964 \u09ae\u09cb\u099f \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf 4N \u09b8\u09be\u0987\u099c\u09c7\u09b0 \u0985\u09cd\u09af\u09be\u09b0\u09c7\u0964",
    "timeComplexity": "O(log N) per Query / Update, O(N) Build",
    "spaceComplexity": "O(4N)",
    "solutionCode": "public class SegmentTree\n{\n    private readonly int[] tree;\n    private readonly int n;\n    public SegmentTree(int[] arr)\n    {\n        n = arr.Length; tree = new int[4 * n];\n        Build(arr, 1, 0, n - 1);\n    }\n    // Build, Update(idx, val), Query(L, R) all O(log N)\n}"
  },
  {
    "id": "cp-dsu-path-compression",
    "name": "Disjoint Set Union (DSU) with Path Compression & Union by Rank",
    "nameBn": "\u09a1\u09bf\u098f\u09b8\u0987\u0989: \u09aa\u09be\u09a5 \u0995\u09ae\u09cd\u09aa\u09cd\u09b0\u09c7\u09b6\u09a8 \u098f\u09ac\u0982 \u0987\u0989\u09a8\u09bf\u09df\u09a8 \u09ac\u09be\u0987 \u09b0\u200d\u09cd\u09af\u09be\u0999\u09cd\u0995",
    "source": "CSES",
    "sourceAbbr": "CSES",
    "url": "https://cses.fi/problemset/task/1676",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "DSU",
      "Graph",
      "Kruskal",
      "Data Structures"
    ],
    "subjectSlug": "competitive-programming",
    "subjectName": "Competitive Programming",
    "appearsIn": [
      {
        "title": "Fast I/O & Tree Structures",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "DSU manages dynamic partitioned sets. Find(x) applies path compression by pointing every visited node directly to the representative root. Union(x, y) attaches the shallower tree under the deeper tree (union by rank/size). Combined, each find/union operation executes in near-constant amortized time O(alpha(N)) via the inverse Ackermann function.",
    "solutionBn": "\u09a1\u09bf\u098f\u09b8\u0987\u0989 \u0997\u09cd\u09b0\u09be\u09ab\u09c7\u09b0 \u0995\u09be\u09a8\u09c7\u0995\u09cd\u099f\u09bf\u09ad\u09bf\u099f\u09bf \u098f\u09ac\u0982 \u09b8\u09be\u0987\u0995\u09c7\u09b2 \u09b6\u09a8\u09be\u0995\u09cd\u09a4\u0995\u09b0\u09a3\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09c3\u09a4 \u09b9\u09af\u09bc\u0964 \u09ab\u09be\u0987\u09a8\u09cd\u09a1 \u0985\u09aa\u09be\u09b0\u09c7\u09b6\u09a8\u09c7\u09b0 \u09b8\u09ae\u09af\u09bc \u09aa\u09be\u09a5 \u0995\u09ae\u09cd\u09aa\u09cd\u09b0\u09c7\u09b6\u09a8\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09a8\u09cb\u09a1\u0995\u09c7 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09ae\u09c2\u09b2 \u09b0\u09c1\u099f \u09a8\u09cb\u09a1\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u0986\u09b0 \u0987\u0989\u09a8\u09bf\u09df\u09a8 \u09ac\u09be\u0987 \u09b0\u200d\u09cd\u09af\u09be\u0999\u09cd\u0995\u09c7 \u099b\u09cb\u099f \u0997\u09be\u099b\u099f\u09bf\u0995\u09c7 \u09ac\u09dc \u0997\u09be\u099b\u09c7\u09b0 \u09a8\u09bf\u099a\u09c7 \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u098f\u09b0 \u09ab\u09b2\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf \u0985\u09aa\u09be\u09b0\u09c7\u09b6\u09a8\u09c7 \u09aa\u09cd\u09b0\u09be\u09df O(1) \u09b8\u09ae\u09df \u09b2\u09be\u0997\u09c7\u0964",
    "timeComplexity": "O(alpha(N)) \u2248 O(1) amortized",
    "spaceComplexity": "O(N)",
    "solutionCode": "public class DSU\n{\n    int[] parent, rank;\n    public DSU(int n)\n    {\n        parent = Enumerable.Range(0, n).ToArray();\n        rank = new int[n];\n    }\n    public int Find(int i) => parent[i] == i ? i : (parent[i] = Find(parent[i]));\n    public bool Union(int i, int j)\n    {\n        int rootI = Find(i), rootJ = Find(j);\n        if (rootI == rootJ) return false;\n        if (rank[rootI] < rank[rootJ]) parent[rootI] = rootJ;\n        else { parent[rootJ] = rootI; if (rank[rootI] == rank[rootJ]) rank[rootI]++; }\n        return true;\n    }\n}"
  },
  {
    "id": "dotnet-di-lifetimes",
    "name": "ASP.NET Core DI Service Lifetimes: Transient, Scoped, Singleton",
    "nameBn": "\u098f\u098f\u09b8\u09aa\u09bf \u09a1\u099f\u09a8\u09c7\u099f \u0995\u09cb\u09b0 \u09a1\u09bf\u0986\u0987 \u09b2\u09be\u0987\u09ab\u099f\u09be\u0987\u09ae: \u099f\u09cd\u09b0\u09be\u09a8\u099c\u09bf\u09af\u09bc\u09c7\u09a8\u09cd\u099f, \u09b8\u09cd\u0995\u09cb\u09aa\u09a1, \u09b8\u09bf\u0999\u09cd\u0997\u09c7\u09b2\u099f\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Brain Station 23",
    "tags": [
      ".NET",
      "ASP.NET Core",
      "Dependency Injection",
      "Architecture"
    ],
    "subjectSlug": "dotnet",
    "subjectName": ".NET Core / ASP.NET",
    "appearsIn": [
      {
        "title": "ASP.NET Core & Web APIs",
        "url": "/subjects/dotnet"
      },
      {
        "title": "Dependency Injection Container",
        "url": "/subjects/oop"
      }
    ],
    "solutionEn": "1. Transient: Created every time requested (lightweight, stateless services). 2. Scoped: Created once per client HTTP request lifecycle (ideal for EF Core DbContext, user sessions). 3. Singleton: Created once on startup and shared across all incoming requests throughout app lifecycle. Danger: Captive Dependency occurs when a Singleton takes a Scoped service as a dependency, holding on to it indefinitely and causing DbContext concurrency/thread bugs.",
    "solutionBn": "\u09e7. Transient: \u09af\u09a4\u09ac\u09be\u09b0 \u099a\u09be\u0993\u09df\u09be \u09b9\u09df \u09a4\u09a4\u09ac\u09be\u09b0 \u09a8\u09a4\u09c1\u09a8 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a4\u09c8\u09b0\u09bf \u09b9\u09df (\u09b9\u09be\u09b2\u0995\u09be \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8\u09c7\u09b0 \u099c\u09a8\u09cd\u09af)\u0964 \u09e8. Scoped: \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u098f\u0987\u099a\u099f\u09bf\u099f\u09bf\u09aa\u09bf \u09b0\u09bf\u0995\u09cb\u09df\u09c7\u09b8\u09cd\u099f\u09c7 \u098f\u0995\u09ac\u09be\u09b0 \u09a4\u09c8\u09b0\u09bf \u09b9\u09df \u098f\u09ac\u0982 \u09b0\u09bf\u0995\u09cb\u09df\u09c7\u09b8\u09cd\u099f \u09b6\u09c7\u09b7 \u09b9\u09b2\u09c7 \u09a7\u09cd\u09ac\u0982\u09b8 \u09b9\u09df (\u09af\u09c7\u09ae\u09a8 EF Core DbContext)\u0964 \u09e9. Singleton: \u0985\u09cd\u09af\u09be\u09aa\u09cd\u09b2\u09bf\u0995\u09c7\u09b6\u09a8 \u099a\u09be\u09b2\u09c1\u09b0 \u09aa\u09b0 \u098f\u0995\u09ac\u09be\u09b0 \u09a4\u09c8\u09b0\u09bf \u09b9\u09df\u09c7 \u09b8\u09be\u09b0\u09be\u099c\u09c0\u09ac\u09a8 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf\u09a4\u09c7 \u09a5\u09be\u0995\u09c7\u0964 \u09b8\u09a4\u09b0\u09cd\u0995\u09ac\u09be\u09b0\u09cd\u09a4\u09be: \u09b8\u09bf\u0999\u09cd\u0997\u09c7\u09b2\u099f\u09a8\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u0995\u0996\u09a8\u09cb\u0987 \u09b8\u09cd\u0995\u09cb\u09aa\u09a1 \u09b8\u09be\u09b0\u09cd\u09ad\u09bf\u09b8 \u0987\u09a8\u099c\u09c7\u0995\u09cd\u099f \u0995\u09b0\u09be \u09af\u09be\u09ac\u09c7 \u09a8\u09be (Captive Dependency)\u0964",
    "timeComplexity": "O(1) resolution",
    "spaceComplexity": "O(1)",
    "solutionCode": "builder.Services.AddTransient<IEmailSender, EmailSender>();\nbuilder.Services.AddScoped<IOrderRepository, OrderRepository>(); // Per HTTP request\nbuilder.Services.AddSingleton<ICacheManager, MemoryCacheManager>(); // App lifetime"
  },
  {
    "id": "dotnet-middleware-pipeline",
    "name": "Custom Middleware & Execution Order in ASP.NET Core",
    "nameBn": "\u098f\u098f\u09b8\u09aa\u09bf \u09a1\u099f\u09a8\u09c7\u099f\u09c7 \u0995\u09be\u09b8\u09cd\u099f\u09ae \u09ae\u09bf\u09a1\u09b2\u0993\u09df\u09cd\u09af\u09be\u09b0 \u0993 \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u09b6\u09a8 \u0985\u09b0\u09cd\u09a1\u09be\u09b0",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "BJIT Group",
    "tags": [
      "ASP.NET Core",
      "HTTP",
      "Middleware",
      "Web API"
    ],
    "subjectSlug": "dotnet",
    "subjectName": ".NET Core / ASP.NET",
    "appearsIn": [
      {
        "title": "ASP.NET Core Web APIs",
        "url": "/subjects/dotnet"
      }
    ],
    "solutionEn": "ASP.NET Core processes requests via a bidirectional Russian-doll pipeline of delegates (RequestDelegate next). Order is critical: ExceptionHandling -> HTTPS Redirection -> Routing -> CORS -> Authentication -> Authorization -> Custom Middleware -> Endpoints. Invoking await next(context) passes execution down the pipeline; after subsequent middleware finish, control unwinds backward to complete response modifications.",
    "solutionBn": "\u098f\u0987\u099a\u099f\u09bf\u099f\u09bf\u09aa\u09bf \u09b0\u09bf\u0995\u09cb\u09df\u09c7\u09b8\u09cd\u099f \u098f\u0995\u099f\u09bf \u09a6\u09cd\u09ac\u09bf\u09ae\u09c1\u0996\u09c0 \u09aa\u09be\u0987\u09aa\u09b2\u09be\u0987\u09a8\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af \u09a6\u09bf\u09df\u09c7 \u09af\u09be\u09df\u0964 \u0995\u09cd\u09b0\u09ae \u0996\u09c1\u09ac\u0987 \u0997\u09c1\u09b0\u09c1\u09a4\u09cd\u09ac\u09aa\u09c2\u09b0\u09cd\u09a3: ExceptionHandling -> Routing -> CORS -> Authentication -> Authorization -> Endpoints\u0964 await next(context) \u0995\u09b2 \u0995\u09b0\u09be\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09aa\u09b0\u09ac\u09b0\u09cd\u09a4\u09c0 \u09ae\u09bf\u09a1\u09b2\u0993\u09df\u09cd\u09af\u09be\u09b0\u09c7 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09df \u098f\u09ac\u0982 \u09b0\u09c7\u09b8\u09aa\u09a8\u09cd\u09b8 \u09ab\u09c7\u09b0\u09a4 \u0986\u09b8\u09be\u09b0 \u09b8\u09ae\u09df\u0993 \u098f\u099f\u09bf \u0995\u09cd\u09b0\u09ae\u09be\u09a8\u09cd\u09ac\u09df\u09c7 \u09aa\u09c7\u099b\u09a8\u09c7\u09b0 \u09a6\u09bf\u0995\u09c7 \u09aa\u09cd\u09b0\u09b8\u09c7\u09b8 \u09b9\u09df\u0964",
    "timeComplexity": "O(1) per middleware layer",
    "spaceComplexity": "O(1)",
    "solutionCode": "public class PerformanceLoggingMiddleware\n{\n    private readonly RequestDelegate _next;\n    public PerformanceLoggingMiddleware(RequestDelegate next) => _next = next;\n    public async Task InvokeAsync(HttpContext context)\n    {\n        var sw = Stopwatch.StartNew();\n        await _next(context); // Call next delegate\n        sw.Stop();\n        Console.WriteLine($\"Request {context.Request.Path} took {sw.ElapsedMilliseconds}ms\");\n    }\n}"
  },
  {
    "id": "dotnet-jwt-refresh-tokens",
    "name": "Stateless JWT Authentication & Sliding Refresh Tokens",
    "nameBn": "\u09b8\u09cd\u099f\u09c7\u099f\u09b2\u09c7\u09b8 JWT \u0985\u09a5\u09c7\u09a8\u099f\u09bf\u0995\u09c7\u09b6\u09a8 \u0993 \u09b0\u09bf\u09ab\u09cd\u09b0\u09c7\u09b6 \u099f\u09cb\u0995\u09c7\u09a8 \u0986\u09b0\u09cd\u0995\u09bf\u099f\u09c7\u0995\u099a\u09be\u09b0",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Pathao",
    "tags": [
      "Security",
      "JWT",
      "Authentication",
      "ASP.NET Core"
    ],
    "subjectSlug": "dotnet",
    "subjectName": ".NET Core / ASP.NET",
    "appearsIn": [
      {
        "title": "Production REST APIs & Security",
        "url": "/subjects/dotnet"
      }
    ],
    "solutionEn": "JWT contains Header, Payload (claims), and Signature signed with HMAC-SHA256 or RSA. Because JWT is stateless, access tokens have a short lifespan (e.g. 15 minutes). A cryptographically random Refresh Token with longer expiration (e.g. 7 days) is stored hashed in the database. When the access token expires, the client exchanges the valid refresh token for a brand new token pair (refresh token rotation to prevent replay attacks).",
    "solutionBn": "JWT \u09a4\u09bf\u09a8\u099f\u09bf \u0985\u0982\u09b6 \u09a8\u09bf\u09df\u09c7 \u0997\u09a0\u09bf\u09a4: \u09b9\u09c7\u09a1\u09be\u09b0, \u09aa\u09c7-\u09b2\u09cb\u09a1 \u098f\u09ac\u0982 \u09b8\u09bf\u0997\u09a8\u09c7\u099a\u09be\u09b0\u0964 \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u09b8\u09cd\u099f\u09c7\u099f\u09b2\u09c7\u09b8 \u09b9\u0993\u09df\u09be\u09df \u0985\u09cd\u09af\u09be\u0995\u09cd\u09b8\u09c7\u09b8 \u099f\u09cb\u0995\u09c7\u09a8\u09c7\u09b0 \u09ae\u09c7\u09df\u09be\u09a6 \u09b8\u0982\u0995\u09cd\u09b7\u09bf\u09aa\u09cd\u09a4 (\u09e7\u09eb \u09ae\u09bf\u09a8\u09bf\u099f) \u09b0\u09be\u0996\u09be \u09b9\u09df\u0964 \u09b0\u09bf\u09ab\u09cd\u09b0\u09c7\u09b6 \u099f\u09cb\u0995\u09c7\u09a8 \u09a1\u09be\u099f\u09be\u09ac\u09c7\u099c\u09c7 \u09b9\u09cd\u09af\u09be\u09b6 \u0995\u09b0\u09c7 \u09b0\u09be\u0996\u09be \u09b9\u09df \u09af\u09be \u09a6\u09bf\u09df\u09c7 \u0995\u09cd\u09b2\u09be\u09af\u09bc\u09c7\u09a8\u09cd\u099f \u09aa\u09c1\u09a8\u09b0\u09be\u09af\u09bc \u09a8\u09a4\u09c1\u09a8 \u099f\u09cb\u0995\u09c7\u09a8 \u09b8\u0982\u0997\u09cd\u09b0\u09b9 \u0995\u09b0\u09c7\u0964 \u09b0\u09bf\u09ab\u09cd\u09b0\u09c7\u09b6 \u099f\u09cb\u0995\u09c7\u09a8 \u09b0\u09cb\u099f\u09c7\u09b6\u09a8\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u099f\u09cb\u0995\u09c7\u09a8 \u099a\u09c1\u09b0\u09bf \u0993 \u09b0\u09bf-\u09aa\u09cd\u09b2\u09c7 \u0986\u0995\u09cd\u09b0\u09ae\u09a3 \u09b0\u09cb\u09a7 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(1) token verification",
    "spaceComplexity": "O(1)",
    "solutionCode": "services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)\n    .AddJwtBearer(options => {\n        options.TokenValidationParameters = new TokenValidationParameters {\n            ValidateIssuerSigningKey = true,\n            IssuerSigningKey = new SymmetricSecurityKey(keyBytes),\n            ValidateLifetime = true,\n            ClockSkew = TimeSpan.Zero\n        };\n    });"
  },
  {
    "id": "db-second-highest-salary",
    "name": "Second Highest Salary (Handling NULL & Edge Cases)",
    "nameBn": "\u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09af\u09bc \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u09ac\u09c7\u09a4\u09a8 \u09a8\u09bf\u09b0\u09cd\u09a3\u09af\u09bc (NULL \u0993 \u098f\u099c \u0995\u09c7\u09b8 \u09b9\u09cd\u09af\u09be\u09a8\u09cd\u09a1\u09b2\u09bf\u0982)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/second-highest-salary/",
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "SQL",
      "Subquery",
      "PostgreSQL",
      "Database"
    ],
    "subjectSlug": "database",
    "subjectName": "Database using PostgreSQL",
    "appearsIn": [
      {
        "title": "SQL Indexes & Queries",
        "url": "/subjects/database"
      }
    ],
    "solutionEn": "To return NULL when there are fewer than 2 distinct salaries, wrap the query in an outer SELECT or use DENSE_RANK(): SELECT (SELECT DISTINCT salary FROM Employee ORDER BY salary DESC OFFSET 1 LIMIT 1) AS SecondHighestSalary; Alternatively: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);",
    "solutionBn": "\u09af\u09a6\u09bf \u099f\u09c7\u09ac\u09bf\u09b2\u09c7 \u09ae\u09be\u09a4\u09cd\u09b0 \u098f\u0995\u099f\u09bf \u09b0\u09c7\u0995\u09b0\u09cd\u09a1 \u09a5\u09be\u0995\u09c7 \u09a4\u09ac\u09c7 \u0995\u09cb\u09af\u09bc\u09c7\u09b0\u09bf\u0995\u09c7 \u0985\u09ac\u09b6\u09cd\u09af\u0987 NULL \u09a6\u09bf\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964 \u098f\u099f\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09a4\u09c7 \u098f\u0995\u099f\u09bf \u0986\u0989\u099f\u09be\u09b0 \u09b8\u09bf\u09b2\u09c7\u0995\u09cd\u099f \u0985\u09a5\u09ac\u09be MAX \u09b8\u09be\u09ac\u0995\u09cb\u09df\u09c7\u09b0\u09bf \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be \u09b9\u09df: SELECT MAX(salary) FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee); \u098f\u099f\u09bf \u09b8\u09c1\u09a8\u09cd\u09a6\u09b0\u09ad\u09be\u09ac\u09c7 \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a\u099f\u09bf \u09ac\u09be\u09a6\u09c7 \u09ac\u09be\u0995\u09bf\u0997\u09c1\u09b2\u09cb\u09b0 \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a (\u0985\u09b0\u09cd\u09a5\u09be\u09ce \u09a6\u09cd\u09ac\u09bf\u09a4\u09c0\u09df\u099f\u09bf) \u09b0\u09bf\u099f\u09be\u09b0\u09cd\u09a8 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(N) full scan, O(log N) with index on salary",
    "spaceComplexity": "O(1)",
    "solutionCode": "SELECT MAX(salary) AS SecondHighestSalary \nFROM Employee \nWHERE salary < (SELECT MAX(salary) FROM Employee);"
  },
  {
    "id": "db-b-tree-indexing",
    "name": "PostgreSQL B-Tree Index Internals: Composite Index & Leftmost Prefix",
    "nameBn": "\u09aa\u09cb\u09b8\u09cd\u099f\u0997\u09cd\u09b0\u09c7\u09b8 \u09ac\u09bf-\u099f\u09cd\u09b0\u09bf \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8: \u0995\u09ae\u09cd\u09aa\u09cb\u099c\u09bf\u099f \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8 \u0993 \u09aa\u09cd\u09b0\u09bf\u09ab\u09bf\u0995\u09cd\u09b8 \u09a8\u09bf\u09df\u09ae",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Therap (BD)",
    "tags": [
      "Database",
      "PostgreSQL",
      "Indexing",
      "Performance"
    ],
    "subjectSlug": "database",
    "subjectName": "Database using PostgreSQL",
    "appearsIn": [
      {
        "title": "SQL Indexes & B-Tree Internals",
        "url": "/subjects/database"
      }
    ],
    "solutionEn": "PostgreSQL uses multi-level balanced B-Trees where leaf pages hold sorted keys and item pointers (TIDs). In a composite index (A, B, C), the tree is ordered first by A, then B, then C. Queries filtering on (A) or (A, B) utilize index range scans (Leftmost Prefix Rule). A query filtering ONLY on (B, C) cannot traverse the tree efficiently and falls back to a slow sequential scan.",
    "solutionBn": "\u09ac\u09bf-\u099f\u09cd\u09b0\u09bf \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8\u09c7\u09b0 \u09b2\u09bf\u09ab \u09a8\u09cb\u09a1\u0997\u09c1\u09b2\u09cb \u09b8\u09be\u099c\u09be\u09a8\u09cb \u09a5\u09be\u0995\u09c7 \u098f\u09ac\u0982 \u09aa\u09c7\u099c\u09c7\u09b0 \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 \u09a7\u09b0\u09c7 \u09b0\u09be\u0996\u09c7\u0964 (A, B, C) \u0995\u09ae\u09cd\u09aa\u09cb\u099c\u09bf\u099f \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8 \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09b2\u09c7 \u0995\u09c1\u09df\u09c7\u09b0\u09bf\u09a4\u09c7 \u0985\u09ac\u09b6\u09cd\u09af\u0987 \u09ac\u09be\u09ae\u09a6\u09bf\u0995\u09c7\u09b0 \u09aa\u09cd\u09b0\u09a5\u09ae \u0995\u09b2\u09be\u09ae (A) \u09a5\u09be\u0995\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964 \u0995\u09c7\u09ac\u09b2 B \u0985\u09a5\u09ac\u09be C \u09a6\u09bf\u09df\u09c7 \u09ab\u09bf\u09b2\u09cd\u099f\u09be\u09b0 \u0995\u09b0\u09b2\u09c7 \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8 \u0995\u09be\u099c \u0995\u09b0\u09c7 \u09a8\u09be \u098f\u09ac\u0982 \u09aa\u09c1\u09b0\u09cb \u099f\u09c7\u09ac\u09bf\u09b2\u09c7 \u09b8\u09bf\u0995\u09cb\u09af\u09bc\u09c7\u09a8\u09cd\u09b8\u09bf\u09af\u09bc\u09be\u09b2 \u09b8\u09cd\u0995\u09cd\u09af\u09be\u09a8 \u099a\u09b2\u09c7\u0964",
    "timeComplexity": "O(log N) tree traversal vs O(N) sequential table scan",
    "spaceComplexity": "O(Index Size on disk)",
    "solutionCode": "CREATE INDEX idx_users_org_created ON users (org_id, created_at);\n\n-- Uses index efficiently (Leftmost prefix matched):\nSELECT * FROM users WHERE org_id = 42 AND created_at > '2026-01-01';\n\n-- Cannot use index range scan (skips leftmost column):\nSELECT * FROM users WHERE created_at > '2026-01-01';"
  },
  {
    "id": "db-acid-isolation-levels",
    "name": "ACID Transactions: Dirty Read, Non-Repeatable Read, Phantom Read",
    "nameBn": "ACID \u099f\u09cd\u09b0\u09be\u09a8\u099c\u09cd\u09af\u09be\u0995\u09b6\u09a8 \u0986\u0987\u09b8\u09cb\u09b2\u09c7\u09b6\u09a8: \u09a1\u09be\u09b0\u09cd\u099f\u09bf \u09b0\u09bf\u09a1, \u09ab\u09cd\u09af\u09be\u09a8\u09cd\u099f\u09ae \u09b0\u09bf\u09a1 \u0993 MVCC",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "PostgreSQL",
      "ACID",
      "Transactions",
      "Concurrency"
    ],
    "subjectSlug": "database",
    "subjectName": "Database using PostgreSQL",
    "appearsIn": [
      {
        "title": "ACID Transactions & MVCC",
        "url": "/subjects/database"
      }
    ],
    "solutionEn": "1. Read Uncommitted: Can see uncommitted dirty data. 2. Read Committed (Postgres default): Sees snapshot at statement start; prevents dirty reads. 3. Repeatable Read: Sees snapshot at transaction start; prevents dirty and non-repeatable reads. 4. Serializable: Emulates strict serial execution using predicate locks, preventing phantom writes and write skew.",
    "solutionBn": "\u09aa\u09cb\u09b8\u09cd\u099f\u0997\u09cd\u09b0\u09c7\u09b8 MVCC \u0986\u09b0\u09cd\u0995\u09bf\u099f\u09c7\u0995\u099a\u09be\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 \u09af\u09be\u09a4\u09c7 \u09b0\u09bf\u09a1\u09be\u09b0 \u09b0\u09be\u0987\u099f\u09be\u09b0\u0995\u09c7 \u098f\u09ac\u0982 \u09b0\u09be\u0987\u099f\u09be\u09b0 \u09b0\u09bf\u09a1\u09be\u09b0\u0995\u09c7 \u09ac\u09cd\u09b2\u0995 \u09a8\u09be \u0995\u09b0\u09c7\u0964 \u09b0\u09bf\u09a1 \u0995\u09ae\u09bf\u099f\u09c7\u09a1 \u09ae\u09cb\u09a1\u09c7 \u0986\u09a8\u0995\u09ae\u09bf\u099f\u09c7\u09a1 \u09a1\u09be\u099f\u09be \u09a6\u09c7\u0996\u09be \u09af\u09be\u09df \u09a8\u09be\u0964 \u09b0\u09bf\u09aa\u09bf\u099f\u09c7\u09ac\u09b2 \u09b0\u09bf\u09a1 \u099f\u09cd\u09b0\u09be\u09a8\u099c\u09cd\u09af\u09be\u0995\u09b6\u09a8 \u09b6\u09c1\u09b0\u09c1\u09b0 \u098f\u0995\u099f\u09bf \u09b8\u09cd\u09a8\u09cd\u09af\u09be\u09aa\u09b6\u099f \u09a7\u09b0\u09c7 \u09b0\u09be\u0996\u09c7 \u09ab\u09b2\u09c7 \u098f\u0995\u0987 \u0995\u09c1\u09df\u09c7\u09b0\u09bf \u09ac\u09be\u09b0\u09ac\u09be\u09b0 \u099a\u09be\u09b2\u09be\u09b2\u09c7\u0993 \u098f\u0995\u0987 \u09ae\u09be\u09a8 \u09aa\u09be\u0993\u09df\u09be \u09af\u09be\u09df\u0964 \u09b8\u09bf\u09b0\u09bf\u09df\u09be\u09b2\u09be\u0987\u099c\u09c7\u09ac\u09b2 \u09ae\u09cb\u09a1 \u09b8\u09ac \u09a7\u09b0\u09a8\u09c7\u09b0 \u0985\u09cd\u09af\u09be\u09a8\u09cb\u09ae\u09be\u09b2\u09bf \u0993 \u09ab\u09cd\u09af\u09be\u09a8\u09cd\u099f\u09ae \u09b0\u09bf\u09a1 \u09aa\u09cd\u09b0\u09a4\u09bf\u09b0\u09cb\u09a7 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(1) MVCC snapshot lookup",
    "spaceComplexity": "O(WAL & VACUUM overhead)",
    "solutionCode": "BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nSELECT balance FROM accounts WHERE id = 10;\n-- Other concurrent commits cannot alter this transaction's snapshot\nCOMMIT;"
  },
  {
    "id": "uml-class-relationships",
    "name": "Association vs Aggregation vs Composition in UML",
    "nameBn": "UML \u0995\u09cd\u09b2\u09be\u09b8 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995: \u0985\u09cd\u09af\u09be\u09b8\u09cb\u09b8\u09bf\u09af\u09bc\u09c7\u09b6\u09a8 \u09ac\u09a8\u09be\u09ae \u0985\u09cd\u09af\u09be\u0997\u09cd\u09b0\u09bf\u0997\u09c7\u09b6\u09a8 \u09ac\u09a8\u09be\u09ae \u0995\u09ae\u09cd\u09aa\u09cb\u099c\u09bf\u09b6\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "BJIT Group",
    "tags": [
      "UML",
      "OOP",
      "Software Modeling",
      "Architecture"
    ],
    "subjectSlug": "uml",
    "subjectName": "UML Diagrams",
    "appearsIn": [
      {
        "title": "Class & Sequence Diagrams",
        "url": "/subjects/uml"
      }
    ],
    "solutionEn": "1. Association: Peer relationship ('uses-a', e.g. Teacher and Student). 2. Aggregation (open diamond): Weak ownership ('has-a', independent lifecycles, e.g. Department and Professor; if Department shuts down, Professor still exists). 3. Composition (filled diamond): Strong ownership (co-dependent lifecycles, e.g. Order and OrderLineItem; if Order is deleted, OrderLineItems cease to exist).",
    "solutionBn": "\u09e7. Association: \u09b8\u09be\u09a7\u09be\u09b0\u09a3 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995 ('uses-a')\u0964 \u09e8. Aggregation (\u09ab\u09be\u0981\u0995\u09be \u09a1\u09be\u09df\u09ae\u09a8\u09cd\u09a1): \u09b8\u09cd\u09ac\u09be\u09a7\u09c0\u09a8 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995 ('has-a'), \u09ae\u09c2\u09b2 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a7\u09cd\u09ac\u0982\u09b8 \u09b9\u09b2\u09c7\u0993 \u099a\u09be\u0987\u09b2\u09cd\u09a1 \u09ac\u09c7\u0981\u099a\u09c7 \u09a5\u09be\u0995\u09c7 (\u09af\u09c7\u09ae\u09a8 \u09a1\u09bf\u09aa\u09be\u09b0\u09cd\u099f\u09ae\u09c7\u09a8\u09cd\u099f \u0993 \u09aa\u09cd\u09b0\u09ab\u09c7\u09b8\u09b0)\u0964 \u09e9. Composition (\u09ad\u09b0\u09be\u099f \u09a1\u09be\u09df\u09ae\u09a8\u09cd\u09a1): \u0997\u09ad\u09c0\u09b0 \u09a8\u09bf\u09b0\u09cd\u09ad\u09b0\u09b6\u09c0\u09b2\u09a4\u09be, \u09aa\u09cd\u09af\u09be\u09b0\u09c7\u09a8\u09cd\u099f \u09a7\u09cd\u09ac\u0982\u09b8 \u09b9\u09b2\u09c7 \u099a\u09be\u0987\u09b2\u09cd\u09a1\u09c7\u09b0 \u0985\u09b8\u09cd\u09a4\u09bf\u09a4\u09cd\u09ac \u09a5\u09be\u0995\u09c7 \u09a8\u09be (\u09af\u09c7\u09ae\u09a8 \u0987\u09a8\u09ad\u09af\u09bc\u09c7\u09b8 \u098f\u09ac\u0982 \u0987\u09a8\u09ad\u09af\u09bc\u09c7\u09b8 \u0986\u0987\u099f\u09c7\u09ae)\u0964",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "solutionCode": "// Composition (Lifecycle bound):\npublic class Order {\n    private readonly List<OrderItem> _items = new();\n}\n\n// Aggregation (Independent lifecycles):\npublic class Department {\n    private List<Professor> _professors;\n}"
  },
  {
    "id": "dp-thread-safe-singleton",
    "name": "Thread-Safe Lazy Singleton with Double-Checked Locking & Lazy<T>",
    "nameBn": "\u09a5\u09cd\u09b0\u09c7\u09a1-\u09b8\u09c7\u09ab \u09b2\u09c7\u099c\u09bf \u09b8\u09bf\u0999\u09cd\u0997\u09c7\u09b2\u099f\u09a8: \u09a1\u09be\u09ac\u09b2-\u099a\u09c7\u0995\u09a1 \u09b2\u0995\u09bf\u0982 \u09ac\u09a8\u09be\u09ae Lazy<T>",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Brain Station 23",
    "tags": [
      "Design Patterns",
      "Concurrency",
      "C#",
      "GoF"
    ],
    "subjectSlug": "design-patterns",
    "subjectName": "Design Patterns",
    "appearsIn": [
      {
        "title": "GoF Creational Patterns",
        "url": "/subjects/design-patterns"
      },
      {
        "title": "SOLID Principles in Depth",
        "url": "/subjects/oop"
      }
    ],
    "solutionEn": "Traditional double-checked locking tests if instance == null before acquiring a lock, and verifies again inside the critical section. However, in modern .NET, Lazy<T> is the idiomatic, high-performance solution that handles thread-safe initialization, memory barriers, and lazy evaluation natively without explicit sync primitives.",
    "solutionBn": "\u09a1\u09be\u09ac\u09b2 \u099a\u09c7\u0995\u09a1 \u09b2\u0995\u09bf\u0982-\u098f \u09b2\u0995\u09bf\u0982 \u0993\u09ad\u09be\u09b0\u09b9\u09c7\u09a1 \u0995\u09ae\u09be\u09a4\u09c7 \u09aa\u09cd\u09b0\u09a5\u09ae\u09c7 \u098f\u0995\u09ac\u09be\u09b0 \u099a\u09c7\u0995 \u0995\u09b0\u09be \u09b9\u09df, \u09a8\u09be\u09b2 \u09a5\u09be\u0995\u09b2\u09c7 \u09b2\u0995 \u09a8\u09bf\u09df\u09c7 \u09aa\u09c1\u09a8\u09b0\u09be\u09df \u099a\u09c7\u0995 \u0995\u09b0\u09c7 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09ac\u09be\u09a8\u09be\u09a8\u09cb \u09b9\u09df\u0964 \u0986\u09a7\u09c1\u09a8\u09bf\u0995 .NET \u098f System.Lazy<T> \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be \u09b8\u09c7\u09b0\u09be \u0989\u09aa\u09be\u09df\u2014\u098f\u099f\u09bf \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u09ac\u09cd\u09af\u09be\u09b0\u09bf\u09df\u09be\u09b0 \u0993 \u09a5\u09cd\u09b0\u09c7\u09a1-\u09b8\u09c7\u09ab\u099f\u09bf \u09b8\u09cd\u09ac\u09df\u0982\u0995\u09cd\u09b0\u09bf\u09df\u09ad\u09be\u09ac\u09c7 \u09b9\u09cd\u09af\u09be\u09a8\u09cd\u09a1\u09c7\u09b2 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public sealed class ConfigurationManager\n{\n    private static readonly Lazy<ConfigurationManager> _instance =\n        new(() => new ConfigurationManager(), LazyThreadSafetyMode.ExecutionAndPublication);\n\n    public static ConfigurationManager Instance => _instance.Value;\n    private ConfigurationManager() { /* Load configs */ }\n}"
  },
  {
    "id": "dp-factory-vs-abstract-factory",
    "name": "Factory Method vs Abstract Factory Pattern",
    "nameBn": "\u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09b0\u09bf \u09ae\u09c7\u09a5\u09a1 \u09ac\u09a8\u09be\u09ae \u0985\u09cd\u09af\u09be\u09ac\u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u09cd\u099f \u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09b0\u09bf \u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "Design Patterns",
      "Creational",
      "GoF",
      "Architecture"
    ],
    "subjectSlug": "design-patterns",
    "subjectName": "Design Patterns",
    "appearsIn": [
      {
        "title": "GoF Creational Patterns",
        "url": "/subjects/design-patterns"
      }
    ],
    "solutionEn": "Factory Method defines an interface for creating a single product, letting subclasses decide which concrete class to instantiate. Abstract Factory creates families of related or dependent products (e.g. DarkThemeButton, DarkThemeScrollbar) without specifying their concrete classes. Abstract Factory is composed of multiple Factory Methods.",
    "solutionBn": "\u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09b0\u09bf \u09ae\u09c7\u09a5\u09a1 \u098f\u0995\u0995 \u0995\u09cb\u09a8\u09cb \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09a4\u09c8\u09b0\u09bf\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u09be\u09ac-\u0995\u09cd\u09b2\u09be\u09b8\u0995\u09c7 \u09b8\u09bf\u09a6\u09cd\u09a7\u09be\u09a8\u09cd\u09a4 \u09a8\u09bf\u09a4\u09c7 \u09a6\u09c7\u09df\u0964 \u0986\u09b0 \u0985\u09cd\u09af\u09be\u09ac\u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u09cd\u099f \u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09b0\u09bf \u098f\u0995\u099f\u09bf \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09b8\u09ae\u09cd\u09aa\u09b0\u09cd\u0995\u09bf\u09a4 \u09aa\u09b0\u09bf\u09ac\u09be\u09b0\u09c7\u09b0 \u098f\u0995\u09be\u09a7\u09bf\u0995 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u098f\u0995\u09b8\u09be\u09a5\u09c7 \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c7 (\u09af\u09c7\u09ae\u09a8 \u09a1\u09be\u09b0\u09cd\u0995 \u09ae\u09cb\u09a1\u09c7\u09b0 \u09ac\u09be\u099f\u09a8 \u0993 \u099f\u09c7\u0995\u09cd\u09b8\u099f\u09ac\u0995\u09cd\u09b8)\u0964 \u098f\u0995\u09be\u09a7\u09bf\u0995 \u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09b0\u09bf \u09ae\u09c7\u09a5\u09a1 \u09ae\u09bf\u09b2\u09c7\u0987 \u098f\u0995\u099f\u09bf \u0985\u09cd\u09af\u09be\u09ac\u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u09cd\u099f \u09ab\u09cd\u09af\u09be\u0995\u09cd\u099f\u09b0\u09bf \u0997\u09a0\u09bf\u09a4 \u09b9\u09df\u0964",
    "timeComplexity": "O(1)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public interface IUIFactory\n{\n    IButton CreateButton();\n    ITextBox CreateTextBox();\n}\npublic class DarkThemeFactory : IUIFactory\n{\n    public IButton CreateButton() => new DarkButton();\n    public ITextBox CreateTextBox() => new DarkTextBox();\n}"
  },
  {
    "id": "os-process-vs-thread",
    "name": "Process vs Thread: Virtual Address Space & Context Switching",
    "nameBn": "\u09aa\u09cd\u09b0\u09b8\u09c7\u09b8 \u09ac\u09a8\u09be\u09ae \u09a5\u09cd\u09b0\u09c7\u09a1: \u09ad\u09be\u09b0\u09cd\u099a\u09c1\u09af\u09bc\u09be\u09b2 \u0985\u09cd\u09af\u09be\u09a1\u09cd\u09b0\u09c7\u09b8 \u09b8\u09cd\u09aa\u09c7\u09b8 \u0993 \u0995\u09a8\u099f\u09c7\u0995\u09cd\u09b8\u099f \u09b8\u09c1\u0987\u099a\u09bf\u0982",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Operating Systems",
      "Concurrency",
      "Memory",
      "Kernel"
    ],
    "subjectSlug": "os",
    "subjectName": "Operating Systems",
    "appearsIn": [
      {
        "title": "Concurrency & Memory Paging",
        "url": "/subjects/os"
      }
    ],
    "solutionEn": "A Process is an isolated executing program with its own private virtual address space, file descriptors, and security tokens. A Thread is the basic unit of CPU execution inside a process; all threads in a process share the same heap, code, and global data, but own an independent stack and register set. Context switching between processes requires invalidating the CPU TLB cache and changing page tables, making it much more expensive than thread context switching.",
    "solutionBn": "\u09aa\u09cd\u09b0\u09b8\u09c7\u09b8 \u09b9\u09b2\u09cb \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf\u09a4\u09c7 \u098f\u0995\u099f\u09bf \u09b8\u09ae\u09cd\u09aa\u09c2\u09b0\u09cd\u09a3 \u09ac\u09bf\u099a\u09cd\u099b\u09bf\u09a8\u09cd\u09a8 \u09aa\u09cd\u09b0\u09cb\u0997\u09cd\u09b0\u09be\u09ae \u09af\u09be\u09b0 \u09a8\u09bf\u099c\u09b8\u09cd\u09ac \u0985\u09cd\u09af\u09be\u09a1\u09cd\u09b0\u09c7\u09b8 \u09b8\u09cd\u09aa\u09c7\u09b8 \u09a5\u09be\u0995\u09c7\u0964 \u0986\u09b0 \u09a5\u09cd\u09b0\u09c7\u09a1 \u09b9\u09b2\u09cb \u09aa\u09cd\u09b0\u09b8\u09c7\u09b8\u09c7\u09b0 \u0985\u09ad\u09cd\u09af\u09a8\u09cd\u09a4\u09b0\u09c7 \u09b2\u09be\u0987\u099f\u0993\u09af\u09bc\u09c7\u099f \u098f\u0995\u09cd\u09b8\u09bf\u0995\u09bf\u0989\u09b6\u09a8 \u0987\u0989\u09a8\u09bf\u099f \u09af\u09be \u098f\u0995\u0987 \u09b9\u09bf\u09aa \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf \u0993 \u0995\u09cb\u09a1 \u09b6\u09c7\u09df\u09be\u09b0 \u0995\u09b0\u09c7 \u0995\u09bf\u09a8\u09cd\u09a4\u09c1 \u09a8\u09bf\u099c\u09b8\u09cd\u09ac \u09b8\u09cd\u099f\u09cd\u09af\u09be\u0995 \u09ac\u099c\u09be\u09df \u09b0\u09be\u0996\u09c7\u0964 \u09aa\u09cd\u09b0\u09b8\u09c7\u09b8 \u0995\u09a8\u099f\u09c7\u0995\u09cd\u09b8\u099f \u09b8\u09c1\u0987\u099a\u09c7 TLB \u09ab\u09cd\u09b2\u09cd\u09af\u09be\u09b6 \u0995\u09b0\u09a4\u09c7 \u09b9\u09df \u09ac\u09b2\u09c7 \u09a5\u09cd\u09b0\u09c7\u09a1 \u09b8\u09c1\u0987\u099a\u09c7\u09b0 \u099a\u09c7\u09df\u09c7 \u0985\u09a8\u09c7\u0995 \u09ac\u09c7\u09b6\u09bf \u09b8\u09ae\u09df \u09a8\u09c7\u09df\u0964",
    "timeComplexity": "O(1) CPU scheduler quantum dispatch",
    "spaceComplexity": "Process: MBs, Thread: 1MB stack (configurable)",
    "solutionCode": "// In C#, thread pool manages lightweight thread execution\nThreadPool.QueueUserWorkItem(_ => {\n    Console.WriteLine($\"Executing on ThreadId: {Environment.CurrentManagedThreadId}\");\n});"
  },
  {
    "id": "os-deadlock-conditions-bankers",
    "name": "Coffman's 4 Deadlock Conditions & Banker's Safety Algorithm",
    "nameBn": "\u0995\u09ab\u09ae\u09cd\u09af\u09be\u09a8\u09c7\u09b0 \u09ea\u099f\u09bf \u09a1\u09c7\u09a1\u09b2\u0995 \u09b6\u09b0\u09cd\u09a4 \u098f\u09ac\u0982 \u09ac\u09cd\u09af\u09be\u0982\u0995\u09be\u09b0\u09cd\u09b8 \u0985\u09cd\u09af\u09be\u09b2\u0997\u09b0\u09bf\u09a6\u09ae",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "Operating Systems",
      "Deadlock",
      "Concurrency",
      "Algorithms"
    ],
    "subjectSlug": "os",
    "subjectName": "Operating Systems",
    "appearsIn": [
      {
        "title": "Concurrency & Memory Paging",
        "url": "/subjects/os"
      }
    ],
    "solutionEn": "Deadlock requires all 4 Coffman conditions simultaneously: 1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption, 4. Circular Wait. Breaking any one condition prevents deadlocks (e.g. enforcing strict global resource lock hierarchy prevents circular wait). Banker's Algorithm ensures safe states by verifying whether available resources can satisfy at least one active process's maximum request.",
    "solutionBn": "\u09a1\u09c7\u09a1\u09b2\u0995 \u0998\u099f\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09ea\u099f\u09bf \u09b6\u09b0\u09cd\u09a4 \u098f\u0995\u09a4\u09cd\u09b0\u09c7 \u09aa\u09c2\u09b0\u09cd\u09a3 \u09b9\u09a4\u09c7 \u09b9\u09df: \u09e7. \u09ae\u09bf\u0989\u099a\u09c1\u09af\u09bc\u09be\u09b2 \u098f\u0995\u09cd\u09b8\u0995\u09cd\u09b2\u09c1\u09b6\u09a8, \u09e8. \u09b9\u09cb\u09b2\u09cd\u09a1 \u0985\u09cd\u09af\u09be\u09a8\u09cd\u09a1 \u0993\u09af\u09bc\u09c7\u099f, \u09e9. \u09a8\u09cb \u09aa\u09cd\u09b0\u09bf-\u098f\u09ae\u09cd\u09aa\u09b6\u09a8, \u09ea. \u09b8\u09be\u09b0\u09cd\u0995\u09c1\u09b2\u09be\u09b0 \u0993\u09af\u09bc\u09c7\u099f\u0964 \u09af\u09c7\u0995\u09cb\u09a8\u09cb \u098f\u0995\u099f\u09bf \u09b6\u09b0\u09cd\u09a4 \u09ad\u09c7\u0999\u09c7 \u09a6\u09bf\u09b2\u09c7\u0987 \u09a1\u09c7\u09a1\u09b2\u0995 \u098f\u09dc\u09be\u09a8\u09cb \u09b8\u09ae\u09cd\u09ad\u09ac (\u09af\u09c7\u09ae\u09a8 \u09b2\u0995\u09c7\u09b0 \u0995\u09cd\u09b0\u09ae\u09be\u09a8\u09c1\u09b8\u09be\u09b0 \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c7 \u09b8\u09be\u09b0\u09cd\u0995\u09c1\u09b2\u09be\u09b0 \u0993\u09af\u09bc\u09c7\u099f \u09b0\u09cb\u09a7 \u0995\u09b0\u09be)\u0964 \u09ac\u09cd\u09af\u09be\u0982\u0995\u09be\u09b0\u09cd\u09b8 \u0985\u09cd\u09af\u09be\u09b2\u0997\u09b0\u09bf\u09a6\u09ae \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09ac\u09b0\u09be\u09a6\u09cd\u09a6\u09c7\u09b0 \u09aa\u09c2\u09b0\u09cd\u09ac\u09c7 \u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09ae '\u09b8\u09c7\u09ab \u09b8\u09cd\u099f\u09c7\u099f\u09c7' \u09a5\u09be\u0995\u09ac\u09c7 \u0995\u09bf\u09a8\u09be \u09a4\u09be \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(N^2 * M) where N is processes, M is resource types",
    "spaceComplexity": "O(N * M) allocation matrix",
    "solutionCode": "// Safe lock ordering prevents circular wait deadlock:\nobject lockA = new(), lockB = new();\n// Always acquire in same hierarchical order:\nlock (lockA)\n{\n    lock (lockB)\n    {\n        // Critical section\n    }\n}"
  },
  {
    "id": "nw-tcp-3way-handshake",
    "name": "TCP 3-Way Handshake, 4-Way Teardown & TIME_WAIT",
    "nameBn": "\u099f\u09bf\u09b8\u09bf\u09aa\u09bf \u09a5\u09cd\u09b0\u09bf-\u0993\u09af\u09bc\u09c7 \u09b9\u09cd\u09af\u09be\u09a8\u09cd\u09a1\u09b6\u09c7\u0995, \u09ab\u09cb\u09b0-\u0993\u09af\u09bc\u09c7 \u099f\u09bf\u09af\u09bc\u09be\u09b0\u09a1\u09be\u0989\u09a8 \u0993 TIME_WAIT",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Therap (BD)",
    "tags": [
      "Networking",
      "TCP/IP",
      "Protocols",
      "Infrastructure"
    ],
    "subjectSlug": "networks",
    "subjectName": "Computer Networks",
    "appearsIn": [
      {
        "title": "TCP/IP & Web Protocols",
        "url": "/subjects/networks"
      }
    ],
    "solutionEn": "Handshake establishes connection: 1. Client sends SYN (seq=x). 2. Server replies SYN-ACK (seq=y, ack=x+1). 3. Client replies ACK (ack=y+1). Teardown closes connection: FIN -> ACK -> FIN -> ACK. The initiating side enters TIME_WAIT for 2 * Maximum Segment Lifetime (2MSL = typically 60-120s) to guarantee the final ACK was received and drain delayed duplicate packets from the network.",
    "solutionBn": "\u099f\u09bf\u09b8\u09bf\u09aa\u09bf \u0995\u09be\u09a8\u09c7\u0995\u09b6\u09a8 \u09b6\u09c1\u09b0\u09c1 \u09b9\u09df \u09e9\u099f\u09bf \u09a7\u09be\u09aa\u09c7: \u0995\u09cd\u09b2\u09be\u09af\u09bc\u09c7\u09a8\u09cd\u099f \u09aa\u09be\u09a0\u09be\u09af\u09bc SYN, \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u09aa\u09be\u09a0\u09be\u09af\u09bc SYN-ACK, \u0995\u09cd\u09b2\u09be\u09af\u09bc\u09c7\u09a8\u09cd\u099f \u09aa\u09be\u09a0\u09be\u09af\u09bc ACK\u0964 \u0995\u09be\u09a8\u09c7\u0995\u09b6\u09a8 \u09ac\u09a8\u09cd\u09a7 \u0995\u09b0\u09be\u09b0 \u09b8\u09ae\u09df \u09ea\u099f\u09bf \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f (FIN -> ACK -> FIN -> ACK) \u09ac\u09bf\u09a8\u09bf\u09ae\u09df \u09b9\u09df\u0964 \u0995\u09be\u09a8\u09c7\u0995\u09b6\u09a8 \u0995\u09cd\u09b2\u09cb\u099c \u0995\u09b0\u09be\u09b0 \u09aa\u09b0 \u0995\u09cd\u09b2\u09be\u09af\u09bc\u09c7\u09a8\u09cd\u099f \u0995\u09bf\u099b\u09c1 \u09b8\u09ae\u09df TIME_WAIT \u09b8\u09cd\u099f\u09c7\u099f\u09c7 \u09a5\u09be\u0995\u09c7 \u09af\u09be\u09a4\u09c7 \u09a6\u09c7\u09b0\u09bf\u09a4\u09c7 \u0986\u09b8\u09be \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f \u09aa\u09b0\u09ac\u09b0\u09cd\u09a4\u09c0 \u09a8\u09a4\u09c1\u09a8 \u09b8\u09c7\u09b6\u09a8\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09ae\u09bf\u09b2\u09c7 \u09b8\u09ae\u09b8\u09cd\u09af\u09be \u09a8\u09be \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "1.5 RTT for handshake",
    "spaceComplexity": "O(1) socket state table",
    "solutionCode": "// Network latency = 1.5 RTT connection setup + data transfer RTTs\n// TCP Keep-Alive and HTTP/2 multiplexing eliminate redundant handshakes."
  },
  {
    "id": "nw-http1-vs-http2-vs-http3",
    "name": "HTTP/1.1 vs HTTP/2 (Multiplexing) vs HTTP/3 (QUIC over UDP)",
    "nameBn": "\u098f\u0987\u099a\u099f\u09bf\u099f\u09bf\u09aa\u09bf/\u09e7 \u09ac\u09a8\u09be\u09ae \u09e8 \u09ac\u09a8\u09be\u09ae \u09e9: \u09ae\u09be\u09b2\u09cd\u099f\u09bf\u09aa\u09cd\u09b2\u09c7\u0995\u09cd\u09b8\u09bf\u0982 \u0993 \u0995\u09c1\u0987\u0995 \u09aa\u09cd\u09b0\u09cb\u099f\u09cb\u0995\u09b2",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Pathao",
    "tags": [
      "Networking",
      "HTTP/2",
      "HTTP/3",
      "QUIC",
      "Performance"
    ],
    "subjectSlug": "networks",
    "subjectName": "Computer Networks",
    "appearsIn": [
      {
        "title": "TCP/IP, HTTP/2 & WebSockets",
        "url": "/subjects/networks"
      }
    ],
    "solutionEn": "HTTP/1.1 suffered from Head-of-Line (HoL) blocking and required domain sharding / multiple TCP connections. HTTP/2 introduced binary framing, header compression (HPACK), and multiplexing multiple bidirectional streams over a single TCP connection; however, packet loss in TCP blocks all streams. HTTP/3 replaces TCP with QUIC over UDP, providing stream-independent congestion control, 0-RTT handshakes, and connection migration across networks (WiFi to 4G).",
    "solutionBn": "HTTP/1.1 \u098f \u09b9\u09c7\u09a1-\u0985\u09ab-\u09b2\u09be\u0987\u09a8 \u09ac\u09cd\u09b2\u0995\u09bf\u0982 \u09b9\u09a4\u09cb\u0964 HTTP/2 \u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u09ab\u09cd\u09b0\u09c7\u09ae\u09bf\u0982 \u0993 \u09ae\u09be\u09b2\u09cd\u099f\u09bf\u09aa\u09cd\u09b2\u09c7\u0995\u09cd\u09b8\u09bf\u0982 \u098f\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u098f\u0995\u099f\u09bf\u09ae\u09be\u09a4\u09cd\u09b0 \u099f\u09bf\u09b8\u09bf\u09aa\u09bf \u0995\u09be\u09a8\u09c7\u0995\u09b6\u09a8\u09c7 \u09b6\u09a4 \u09b6\u09a4 \u09b0\u09bf\u0995\u09cb\u09af\u09bc\u09c7\u09b8\u09cd\u099f \u09aa\u09be\u09a0\u09be\u09a4\u09c7 \u09aa\u09be\u09b0\u09c7\u0964 \u09a4\u09ac\u09c7 \u098f\u0995\u099f\u09bf \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f \u09b2\u09b8 \u09b9\u09b2\u09c7 \u099f\u09bf\u09b8\u09bf\u09aa\u09bf\u09a4\u09c7 \u09aa\u09c1\u09b0\u09cb \u0995\u09be\u09a8\u09c7\u0995\u09b6\u09a8 \u0986\u099f\u0995\u09c7 \u09af\u09be\u09df\u0964 HTTP/3 \u098f\u0987 \u09b8\u09ae\u09b8\u09cd\u09af\u09be \u09a6\u09c2\u09b0 \u0995\u09b0\u09a4\u09c7 UDP \u098f\u09b0 \u0993\u09aa\u09b0 QUIC \u09aa\u09cd\u09b0\u09cb\u099f\u09cb\u0995\u09b2 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7, \u09ab\u09b2\u09c7 \u098f\u0995 \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ae\u09c7\u09b0 \u09aa\u09cd\u09af\u09be\u0995\u09c7\u099f \u09b2\u09b8 \u0985\u09a8\u09cd\u09af \u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ae\u0995\u09c7 \u0986\u099f\u0995\u09be\u09df \u09a8\u09be\u0964",
    "timeComplexity": "HTTP/3: 0-1 RTT connection setup",
    "spaceComplexity": "O(Active Streams)",
    "solutionCode": "// HTTP/2 & HTTP/3 multiplex requests over a single socket:\n// No connection pool starvation or HoL blocking."
  },
  {
    "id": "sys-rate-limiter",
    "name": "Design a Distributed Rate Limiter with Redis & Token Bucket",
    "nameBn": "\u09b0\u09c7\u09a1\u09bf\u09b8 \u0993 \u099f\u09cb\u0995\u09c7\u09a8 \u09ac\u09be\u0995\u09c7\u099f \u09a6\u09bf\u09af\u09bc\u09c7 \u09a1\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ac\u09bf\u0989\u099f\u09c7\u09a1 \u09b0\u09c7\u099f \u09b2\u09bf\u09ae\u09bf\u099f\u09be\u09b0 \u09a1\u09bf\u099c\u09be\u0987\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "SYS",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "System Design",
      "Redis",
      "Distributed Systems",
      "Scalability"
    ],
    "subjectSlug": "system-design",
    "subjectName": "System Design",
    "appearsIn": [
      {
        "title": "Distributed Systems & Scalability",
        "url": "/subjects/system-design"
      }
    ],
    "solutionEn": "The Token Bucket algorithm allows bursts up to bucket capacity and replenishes tokens at a constant rate. In a distributed architecture with multiple web servers, local in-memory counters cause race conditions. Solution: Execute an atomic Lua script in Redis that checks remaining tokens and updates the refill timestamp in a single atomic roundtrip, avoiding race conditions.",
    "solutionBn": "\u099f\u09cb\u0995\u09c7\u09a8 \u09ac\u09be\u0995\u09c7\u099f \u0985\u09cd\u09af\u09be\u09b2\u0997\u09b0\u09bf\u09a6\u09ae\u09c7 \u098f\u0995\u099f\u09bf \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f \u09b9\u09be\u09b0\u09c7 \u099f\u09cb\u0995\u09c7\u09a8 \u09af\u09cb\u0997 \u09b9\u09df \u098f\u09ac\u0982 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09b0\u09bf\u0995\u09cb\u09df\u09c7\u09b8\u09cd\u099f\u09c7 \u098f\u0995\u099f\u09bf \u099f\u09cb\u0995\u09c7\u09a8 \u0996\u09b0\u099a \u09b9\u09df\u0964 \u09a1\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ac\u09bf\u0989\u099f\u09c7\u09a1 \u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09ae\u09c7 \u098f\u0995\u09be\u09a7\u09bf\u0995 \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0\u09c7\u09b0 \u09ae\u09be\u099d\u09c7 \u09b8\u09be\u09ae\u099e\u09cd\u099c\u09b8\u09cd\u09af \u09b0\u09be\u0996\u09a4\u09c7 \u09b8\u09c7\u09a8\u09cd\u099f\u09cd\u09b0\u09be\u09b2\u09be\u0987\u099c\u09a1 Redis \u0995\u09cd\u09b2\u09be\u09b8\u09cd\u099f\u09be\u09b0\u09c7 \u098f\u0995\u099f\u09bf \u0985\u09cd\u09af\u09be\u099f\u09ae\u09bf\u0995 Lua \u09b8\u09cd\u0995\u09cd\u09b0\u09bf\u09aa\u09cd\u099f \u099a\u09be\u09b2\u09be\u09a8\u09cb \u09b9\u09df\u0964 \u098f\u09a4\u09c7 \u0995\u09cb\u09a8\u09cb \u09b0\u09c7\u09b8 \u0995\u09a8\u09cd\u09a1\u09bf\u09b6\u09a8 \u099b\u09be\u09dc\u09be \u09ae\u09bf\u09b2\u09bf-\u09b8\u09c7\u0995\u09c7\u09a8\u09cd\u09a1\u09c7 \u09b0\u09c7\u099f \u09b2\u09bf\u09ae\u09bf\u099f\u09bf\u0982 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(1) Redis execution",
    "spaceComplexity": "O(Active Users) in Redis RAM",
    "solutionCode": "-- Redis Lua Script for atomic Token Bucket check & decrement\nlocal key = KEYS[1]\nlocal limit = tonumber(ARGV[1])\nlocal current = tonumber(redis.call('get', key) or \"0\")\nif current + 1 > limit then\n    return 0 -- Rate limited (HTTP 429)\nelse\n    redis.call(\"INCRBY\", key, 1)\n    redis.call(\"EXPIRE\", key, 60)\n    return 1 -- Allowed\nend"
  },
  {
    "id": "sys-url-shortener",
    "name": "Design TinyURL: Base62 Encoding vs MD5/MurmurHash with Distributed DB",
    "nameBn": "\u099f\u09be\u0987\u09a8\u09bf\u0987\u0989\u0986\u09b0\u098f\u09b2 \u09a1\u09bf\u099c\u09be\u0987\u09a8: \u09ac\u09c7\u09b8\u09ec\u09e8 \u098f\u09a8\u0995\u09cb\u09a1\u09bf\u0982 \u09ac\u09a8\u09be\u09ae \u09a1\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ac\u09bf\u0989\u099f\u09c7\u09a1 \u0986\u0987\u09a1\u09bf \u099c\u09c7\u09a8\u09be\u09b0\u09c7\u099f\u09b0",
    "source": "BD Tech Interview",
    "sourceAbbr": "SYS",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Brain Station 23",
    "tags": [
      "System Design",
      "Scalability",
      "Hashing",
      "NoSQL"
    ],
    "subjectSlug": "system-design",
    "subjectName": "System Design",
    "appearsIn": [
      {
        "title": "Distributed Systems & Scalability",
        "url": "/subjects/system-design"
      }
    ],
    "solutionEn": "A 7-character Base62 string (a-z, A-Z, 0-9) yields 62^7 \u2248 3.5 trillion unique URLs. Generate unique 64-bit integer IDs using a distributed ID generator (e.g. Twitter Snowflake or DB auto-increment ranges), then convert the ID to Base62. Store mapping in distributed NoSQL/PostgreSQL (hash key: short_code). Place Redis in front of the database for 99% cache hits on redirects (HTTP 301/302).",
    "solutionBn": "\u09ed \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 Base62 \u098f\u09a8\u0995\u09cb\u09a1\u09bf\u0982 \u09a6\u09bf\u09df\u09c7 \u09aa\u09cd\u09b0\u09be\u09df \u09e9.\u09eb \u099f\u09cd\u09b0\u09bf\u09b2\u09bf\u09df\u09a8 \u09b2\u09bf\u0982\u0995 \u09a4\u09c8\u09b0\u09bf \u09b8\u09ae\u09cd\u09ad\u09ac\u0964 \u099f\u09c1\u0987\u099f\u09be\u09b0 \u09b8\u09cd\u09a8\u09cb\u09ab\u09cd\u09b2\u09c7\u0995 \u09a6\u09bf\u09df\u09c7 \u09ec\u09ea-\u09ac\u09bf\u099f \u0987\u0989\u09a8\u09bf\u0995 \u0986\u0987\u09a1\u09bf \u09ac\u09be\u09a8\u09bf\u09df\u09c7 \u09b8\u09c7\u099f\u09bf\u0995\u09c7 Base62 \u09a4\u09c7 \u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u09b0\u09bf\u09a1 \u09aa\u09be\u09b0\u09ab\u09b0\u09ae\u09cd\u09af\u09be\u09a8\u09cd\u09b8 \u09ac\u09be\u09dc\u09be\u09a8\u09cb\u09b0 \u099c\u09a8\u09cd\u09af \u09a1\u09be\u099f\u09be\u09ac\u09c7\u099c\u09c7\u09b0 \u09b8\u09be\u09ae\u09a8\u09c7 Redis \u0995\u09cd\u09af\u09be\u09b6 \u09b0\u09be\u0996\u09be \u09b9\u09df \u09af\u09be \u09ef\u09e6% \u09b0\u09bf\u09a1 \u09b0\u09bf\u0995\u09cb\u09df\u09c7\u09b8\u09cd\u099f \u09a6\u09cd\u09b0\u09c1\u09a4 \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u0995\u09b0\u09c7 (HTTP 301 \u09b0\u09bf\u09a1\u09be\u0987\u09b0\u09c7\u0995\u09cd\u099f)\u0964",
    "timeComplexity": "O(1) redirect resolution",
    "spaceComplexity": "O(N) storage (~100 bytes per URL mapping)",
    "solutionCode": "public static string EncodeBase62(long id)\n{\n    const string chars = \"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ\";\n    var sb = new StringBuilder();\n    while (id > 0) { sb.Append(chars[(int)(id % 62)]); id /= 62; }\n    return sb.ToString();\n}"
  },
  {
    "id": "ai-embeddings-vector-search",
    "name": "Vector Embeddings & Cosine Similarity in RAG Architecture",
    "nameBn": "\u09ad\u09c7\u0995\u09cd\u099f\u09b0 \u098f\u09ae\u09ac\u09c7\u09a1\u09bf\u0982 \u0993 \u0995\u09cb\u09b8\u09be\u0987\u09a8 \u09b8\u09bf\u09ae\u09bf\u09b2\u09be\u09b0\u09bf\u099f\u09bf (RAG \u0986\u09b0\u09cd\u0995\u09bf\u099f\u09c7\u0995\u099a\u09be\u09b0)",
    "source": "BD Tech Interview",
    "sourceAbbr": "SYS",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Kona Software",
    "tags": [
      "AI/ML",
      "Vector DB",
      "RAG",
      "Embeddings"
    ],
    "subjectSlug": "ai-ml",
    "subjectName": "AI & Machine Learning",
    "appearsIn": [
      {
        "title": "AI Fundamentals & Transformers",
        "url": "/subjects/csharp"
      }
    ],
    "solutionEn": "Embedding models convert text chunks into dense floating-point vectors (e.g., 1536 dimensions) capturing semantic meaning. In Retrieval-Augmented Generation (RAG), user queries are embedded into the same vector space. Vector databases (e.g., pgvector, Pinecone) compute Cosine Similarity or Dot Product using HNSW indexes to retrieve top-k semantically relevant chunks to augment the LLM prompt.",
    "solutionBn": "\u098f\u09ae\u09ac\u09c7\u09a1\u09bf\u0982 \u09ae\u09a1\u09c7\u09b2 \u099f\u09c7\u0995\u09cd\u09b8\u099f\u0995\u09c7 \u0989\u099a\u09cd\u099a\u09ae\u09be\u09a4\u09cd\u09b0\u09be\u09b0 \u09ad\u09c7\u0995\u09cd\u099f\u09b0 \u09b8\u0982\u0996\u09cd\u09af\u09be\u09df \u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0 \u0995\u09b0\u09c7 \u09af\u09be \u09b6\u09ac\u09cd\u09a6\u09c7\u09b0 \u0985\u09b0\u09cd\u09a5 \u09a7\u09be\u09b0\u09a3 \u0995\u09b0\u09c7\u0964 RAG \u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09ae\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u0995\u09be\u09b0\u09c0\u09b0 \u09aa\u09cd\u09b0\u09b6\u09cd\u09a8\u0995\u09c7 \u09ad\u09c7\u0995\u09cd\u099f\u09b0\u09c7 \u09b0\u09c2\u09aa\u09be\u09a8\u09cd\u09a4\u09b0 \u0995\u09b0\u09c7 \u09ad\u09c7\u0995\u09cd\u099f\u09b0 \u09a1\u09be\u099f\u09be\u09ac\u09c7\u099c\u09c7 (\u09af\u09c7\u09ae\u09a8 pgvector) \u0995\u09cb\u09b8\u09be\u0987\u09a8 \u09b8\u09bf\u09ae\u09bf\u09b2\u09be\u09b0\u09bf\u099f\u09bf\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09b8\u09ac\u099a\u09c7\u09af\u09bc\u09c7 \u0995\u09be\u099b\u09be\u0995\u09be\u099b\u09bf \u09a1\u0995\u09c1\u09ae\u09c7\u09a8\u09cd\u099f\u0997\u09c1\u09b2\u09cb \u0996\u09c1\u0981\u099c\u09c7 \u09ac\u09c7\u09b0 \u0995\u09b0\u09be \u09b9\u09df \u098f\u09ac\u0982 \u098f\u09b2\u098f\u09b2\u098f\u09ae \u098f\u09b0 \u09aa\u09cd\u09b0\u09ae\u09cd\u09aa\u099f\u09c7 \u09af\u09c1\u0995\u09cd\u09a4 \u0995\u09b0\u09be \u09b9\u09df\u0964",
    "timeComplexity": "O(log N) approximate nearest neighbor via HNSW",
    "spaceComplexity": "O(Dimensions * Documents)",
    "solutionCode": "// PostgreSQL with pgvector cosine distance:\n// SELECT id, content FROM documents \n// ORDER BY embedding <=> $1 LIMIT 5;"
  },
  {
    "id": "hr-star-conflict-resolution",
    "name": "STAR Method: Handling Critical Technical Disagreements with Teammates",
    "nameBn": "STAR \u09ae\u09c7\u09a5\u09a1: \u09b8\u09b9\u0995\u09b0\u09cd\u09ae\u09c0\u09a6\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u099f\u09c7\u0995\u09a8\u09bf\u0995\u09cd\u09af\u09be\u09b2 \u09ae\u09a4\u09ac\u09bf\u09b0\u09cb\u09a7 \u0993 \u09b8\u09ae\u09be\u09a7\u09be\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "Behavioral",
      "Soft Skills",
      "STAR",
      "HR Interview"
    ],
    "subjectSlug": "behavioral",
    "subjectName": "Behavioral & HR Round",
    "appearsIn": [
      {
        "title": "STAR Method & Salary Negotiation",
        "url": "/subjects/csharp"
      }
    ],
    "solutionEn": "Situation: We were designing a service and split between MongoDB vs PostgreSQL. Task: Reach consensus to avoid delaying project sprint. Action: Conducted benchmark proof-of-concept, documented trade-offs objectively regarding transactional consistency vs unstructured schema, and presented findings respectfully in a design review. Result: Team unanimously chose PostgreSQL, shipping on time with zero schema inconsistencies.",
    "solutionBn": "\u09b8\u09bf\u099a\u09c1\u09af\u09bc\u09c7\u09b6\u09a8: \u09aa\u09cd\u09b0\u099c\u09c7\u0995\u09cd\u099f\u09c7 \u09a1\u09c7\u099f\u09be\u09ac\u09c7\u099c \u09ac\u09be\u099b\u09be\u0987 \u09a8\u09bf\u09df\u09c7 \u09ae\u09a4\u09ac\u09bf\u09b0\u09cb\u09a7 \u09b9\u09df\u09c7\u099b\u09bf\u09b2\u0964 \u099f\u09be\u09b8\u09cd\u0995: \u09a8\u09bf\u09b0\u09cd\u09a7\u09be\u09b0\u09bf\u09a4 \u09b8\u09ae\u09df\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b8\u09a0\u09bf\u0995 \u09b8\u09ae\u09be\u09a7\u09be\u09a8\u09c7 \u09aa\u09cc\u0981\u099b\u09be\u09a8\u09cb\u0964 \u0985\u09cd\u09af\u09be\u0995\u09b6\u09a8: \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u0997\u09a4 \u0986\u09ac\u09c7\u0997\u09c7 \u09a8\u09be \u0997\u09bf\u09df\u09c7 \u0989\u09ad\u09af\u09bc \u09a1\u09c7\u099f\u09be\u09ac\u09c7\u099c\u09c7 \u09ac\u09c7\u099e\u09cd\u099a\u09ae\u09be\u09b0\u09cd\u0995 \u099f\u09c7\u09b8\u09cd\u099f \u0995\u09b0\u09c7 \u09b0\u09bf\u09aa\u09cb\u09b0\u09cd\u099f \u0989\u09aa\u09b8\u09cd\u09a5\u09be\u09aa\u09a8 \u0995\u09b0\u09c7\u099b\u09bf\u0964 \u09b0\u09c7\u099c\u09be\u09b2\u09cd\u099f: \u09a6\u09b2\u0997\u09a4\u09ad\u09be\u09ac\u09c7 \u09b8\u09a0\u09bf\u0995 \u09b8\u09bf\u09a6\u09cd\u09a7\u09be\u09a8\u09cd\u09a4 \u09a8\u09c7\u0993\u09df\u09be \u09b9\u09df\u09c7\u099b\u09bf\u09b2 \u098f\u09ac\u0982 \u09aa\u09cd\u09b0\u099c\u09c7\u0995\u09cd\u099f \u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u09a1\u09c7\u09b2\u09bf\u09ad\u09be\u09b0\u09bf \u09a6\u09c7\u0993\u09df\u09be \u09b9\u09df\u09c7\u099b\u09bf\u09b2\u0964",
    "timeComplexity": "Structured 2-minute response",
    "spaceComplexity": "High impact",
    "solutionCode": "// Structure your answer: Situation (20%) -> Task (10%) -> Action (50%) -> Result (20%)"
  },
  {
    "id": "dsa-contains-duplicate",
    "name": "Contains Duplicate",
    "nameBn": "\u09a1\u09c1\u09aa\u09cd\u09b2\u09bf\u0995\u09c7\u099f \u0989\u09aa\u09be\u09a6\u09be\u09a8 \u0989\u09aa\u09b8\u09cd\u09a5\u09bf\u09a4\u09bf \u09af\u09be\u099a\u09be\u0987",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/contains-duplicate/",
    "difficulty": "EASY",
    "company": "BJIT Group",
    "tags": [
      "Array",
      "Hash Table",
      "Sorting"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Collections & Hash Tables",
        "url": "/subjects/csharp/collections-hashset"
      }
    ],
    "solutionEn": "Use a HashSet to record seen numbers. If an element is already in the set, return true. Otherwise insert it. Time: O(N), Space: O(N).",
    "solutionBn": "\u098f\u0995\u099f\u09bf \u09b9\u09cd\u09af\u09be\u09b6\u09b8\u09c7\u099f \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 \u09aa\u09c2\u09b0\u09cd\u09ac\u09c7\u09b0 \u09b8\u0982\u0996\u09cd\u09af\u09be\u0997\u09c1\u09b2\u09cb \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995 \u0995\u09b0\u09c1\u09a8\u0964 \u0995\u09cb\u09a8\u09cb \u09b8\u0982\u0996\u09cd\u09af\u09be \u09b8\u09c7\u099f\u09c7 \u0986\u0997\u09c7 \u09a5\u09c7\u0995\u09c7\u0987 \u09a5\u09be\u0995\u09b2\u09c7 \u099f\u09cd\u09b0\u09c1 \u09a6\u09bf\u09a8\u0964 \u09b8\u09ae\u09df: O(N), \u09b8\u09cd\u09aa\u09c7\u09b8: O(N)\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "solutionCode": "public bool ContainsDuplicate(int[] nums) => new HashSet<int>(nums).Count < nums.Length;"
  },
  {
    "id": "dsa-valid-anagram",
    "name": "Valid Anagram",
    "nameBn": "\u09ad\u09cd\u09af\u09be\u09b2\u09bf\u09a1 \u0985\u09cd\u09af\u09be\u09a8\u09be\u0997\u09cd\u09b0\u09be\u09ae \u09af\u09be\u099a\u09be\u0987",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/valid-anagram/",
    "difficulty": "EASY",
    "company": "Therap (BD)",
    "tags": [
      "String",
      "Hash Table",
      "Sorting"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "String Processing",
        "url": "/subjects/csharp/strings-methods"
      }
    ],
    "solutionEn": "Count character frequencies using an integer frequency array of size 26. Increment counts for string s, decrement for string t. If all frequencies return to 0, they are anagrams.",
    "solutionBn": "\u09e8\u09ec \u0986\u0995\u09be\u09b0\u09c7\u09b0 \u098f\u0995\u099f\u09bf \u0987\u09a8\u09cd\u099f\u09bf\u099c\u09be\u09b0 \u0985\u09cd\u09af\u09be\u09b0\u09c7 \u09a6\u09bf\u09df\u09c7 \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 \u09ab\u09cd\u09b0\u09bf\u0995\u09cb\u09df\u09c7\u09a8\u09cd\u09b8\u09bf \u09b9\u09bf\u09b8\u09be\u09ac \u0995\u09b0\u09c1\u09a8\u0964 s \u098f\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u0982\u0996\u09cd\u09af\u09be \u09ac\u09be\u09dc\u09be\u09a8 \u098f\u09ac\u0982 t \u098f\u09b0 \u099c\u09a8\u09cd\u09af \u0995\u09ae\u09be\u09a8\u0964 \u09b8\u09ac \u09b6\u09c7\u09b7\u09c7 \u09b8\u09ac \u09ae\u09be\u09a8 \u09e6 \u09a5\u09be\u0995\u09b2\u09c7 \u0985\u09cd\u09af\u09be\u09a8\u09be\u0997\u09cd\u09b0\u09be\u09ae\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1) (26 characters)",
    "solutionCode": "public bool IsAnagram(string s, string t) {\n    if (s.Length != t.Length) return false;\n    int[] counts = new int[26];\n    for (int i = 0; i < s.Length; i++) { counts[s[i] - 'a']++; counts[t[i] - 'a']--; }\n    return counts.All(c => c == 0);\n}"
  },
  {
    "id": "dsa-longest-consecutive-sequence",
    "name": "Longest Consecutive Sequence in O(N)",
    "nameBn": "O(N) \u09b8\u09ae\u09df\u09c7 \u09a6\u09c0\u09b0\u09cd\u0998\u09a4\u09ae \u09a7\u09be\u09b0\u09be\u09ac\u09be\u09b9\u09bf\u0995 \u09b8\u0982\u0996\u09cd\u09af\u09be\u09b0 \u0985\u09a8\u09c1\u0995\u09cd\u09b0\u09ae",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/longest-consecutive-sequence/",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Array",
      "Hash Table",
      "Union Find"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Asymptotic Complexity",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Store all numbers in a HashSet for O(1) membership lookups. For each number num, only start a streak check if (num - 1) does NOT exist in the set (meaning num is the start of a sequence). Count consecutive increments. This guarantees each number is visited at most twice, yielding linear O(N) time.",
    "solutionBn": "\u09b8\u09ac \u09b8\u0982\u0996\u09cd\u09af\u09be\u0995\u09c7 \u098f\u0995\u099f\u09bf \u09b9\u09cd\u09af\u09be\u09b6\u09b8\u09c7\u099f\u09c7 \u09b0\u09be\u0996\u09c1\u09a8\u0964 \u09b6\u09c1\u09a7\u09c1\u09ae\u09be\u09a4\u09cd\u09b0 \u09a4\u0996\u09a8\u0987 \u09b2\u09c1\u09aa \u099a\u09be\u09b2\u09bf\u09df\u09c7 \u09a6\u09c8\u09b0\u09cd\u0998\u09cd\u09af \u09ae\u09be\u09aa\u09c1\u09a8 \u09af\u0996\u09a8 (num - 1) \u09b8\u09c7\u099f\u09c7 \u09a5\u09be\u0995\u09ac\u09c7 \u09a8\u09be (\u0985\u09b0\u09cd\u09a5\u09be\u09ce \u098f\u099f\u09bf \u09b8\u09bf\u0995\u09cb\u09af\u09bc\u09c7\u09a8\u09cd\u09b8\u09c7\u09b0 \u09b8\u09c2\u099a\u09a8\u09be)\u0964 \u09ab\u09b2\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf \u0989\u09aa\u09be\u09a6\u09be\u09a8 \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u09a6\u09c1\u0987\u09ac\u09be\u09b0 \u099a\u09c7\u0995 \u09b9\u09df \u098f\u09ac\u0982 O(N) \u09b8\u09ae\u09df\u09c7 \u0989\u09a4\u09cd\u09a4\u09b0 \u09aa\u09be\u0993\u09df\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N)",
    "solutionCode": "public int LongestConsecutive(int[] nums) {\n    var set = new HashSet<int>(nums);\n    int maxLen = 0;\n    foreach (var n in set) {\n        if (!set.Contains(n - 1)) {\n            int curr = n, len = 1;\n            while (set.Contains(curr + 1)) { curr++; len++; }\n            maxLen = Math.Max(maxLen, len);\n        }\n    }\n    return maxLen;\n}"
  },
  {
    "id": "dsa-3sum",
    "name": "3Sum (Zero-Sum Triplet Search)",
    "nameBn": "\u09a5\u09cd\u09b0\u09bf-\u09b8\u09be\u09ae (\u09a4\u09bf\u09a8\u099f\u09bf \u09b8\u0982\u0996\u09cd\u09af\u09be\u09b0 \u09af\u09cb\u0997\u09ab\u09b2 \u09b6\u09c2\u09a8\u09cd\u09af)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/3sum/",
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "Array",
      "Two Pointers",
      "Sorting"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Standard Algorithmic Techniques",
        "url": "/subjects/dsa/asymptotic-complexity"
      }
    ],
    "solutionEn": "Sort the array. Fix the first element nums[i], then use two pointers (left = i + 1, right = n - 1) to find pairs summing to -nums[i]. Skip duplicates for both i, left, and right to ensure unique triplets. Time: O(N^2), Space: O(1) auxiliary.",
    "solutionBn": "\u0985\u09cd\u09af\u09be\u09b0\u09c7 \u09b8\u09be\u099c\u09bf\u09df\u09c7 \u09a8\u09bf\u09a8\u0964 \u09aa\u09cd\u09b0\u09a5\u09ae \u0989\u09aa\u09be\u09a6\u09be\u09a8\u099f\u09bf \u09ab\u09bf\u0995\u09cd\u09b8 \u0995\u09b0\u09c7 \u09ac\u09be\u0995\u09bf \u0985\u0982\u09b6\u09c7 \u099f\u09c1 \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 \u09a6\u09bf\u09df\u09c7 \u09ac\u09be\u0995\u09bf \u09a6\u09c1\u099f\u09bf \u09b8\u0982\u0996\u09cd\u09af\u09be \u0996\u09c1\u0981\u099c\u09c1\u09a8\u0964 \u09a1\u09c1\u09aa\u09cd\u09b2\u09bf\u0995\u09c7\u099f \u098f\u09dc\u09be\u09a4\u09c7 \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 \u09b8\u09b0\u09be\u09a8\u09cb\u09b0 \u09b8\u09ae\u09df \u098f\u0995\u0987 \u09b8\u0982\u0996\u09cd\u09af\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u09cd\u0995\u09bf\u09aa \u0995\u09b0\u09c1\u09a8\u0964 \u099f\u09be\u0987\u09ae: O(N^2)\u0964",
    "timeComplexity": "O(N^2)",
    "spaceComplexity": "O(1) auxiliary",
    "solutionCode": "// Sort array, fix i, two pointers on [i+1, n-1] skipping duplicates"
  },
  {
    "id": "dsa-longest-substring-without-repeat",
    "name": "Longest Substring Without Repeating Characters",
    "nameBn": "\u09aa\u09c1\u09a8\u09b0\u09be\u09ac\u09c3\u09a4\u09cd\u09a4\u09bf\u09b9\u09c0\u09a8 \u09a6\u09c0\u09b0\u09cd\u0998\u09a4\u09ae \u09b8\u09be\u09ac\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u0982",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "String",
      "Sliding Window",
      "Hash Table"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Sliding Window Techniques",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Use sliding window [left, right] and a hash map of char -> last seen index. When a duplicate char is encountered within the current window, jump left = map[char] + 1. Update max length at each step. Time: O(N), Space: O(min(M, N)).",
    "solutionBn": "\u09b8\u09cd\u09b2\u09be\u0987\u09a1\u09bf\u0982 \u0989\u0987\u09a8\u09cd\u09a1\u09cb \u098f\u09ac\u0982 \u09b9\u09cd\u09af\u09be\u09b6\u09ae\u09cd\u09af\u09be\u09aa \u09a6\u09bf\u09df\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 \u09b8\u09b0\u09cd\u09ac\u09b6\u09c7\u09b7 \u0987\u09a8\u09a1\u09c7\u0995\u09cd\u09b8 \u099f\u09cd\u09b0\u09cd\u09af\u09be\u0995 \u0995\u09b0\u09c1\u09a8\u0964 \u0995\u09cb\u09a8\u09cb \u09a1\u09c1\u09aa\u09cd\u09b2\u09bf\u0995\u09c7\u099f \u0985\u0995\u09cd\u09b7\u09b0 \u09aa\u09c7\u09b2\u09c7 \u09ac\u09be\u09ae \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0\u0995\u09c7 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09a1\u09c1\u09aa\u09cd\u09b2\u09bf\u0995\u09c7\u099f\u09c7\u09b0 \u09aa\u09b0\u09c7\u09b0 \u0998\u09b0\u09c7 \u09a8\u09bf\u09df\u09c7 \u0986\u09b8\u09c1\u09a8\u0964 \u099f\u09be\u0987\u09ae: O(N)\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(min(M, N))",
    "solutionCode": "public int LengthOfLongestSubstring(string s) {\n    var lastSeen = new Dictionary<char, int>();\n    int maxLen = 0, l = 0;\n    for (int r = 0; r < s.Length; r++) {\n        if (lastSeen.TryGetValue(s[r], out int idx) && idx >= l) l = idx + 1;\n        lastSeen[s[r]] = r;\n        maxLen = Math.Max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}"
  },
  {
    "id": "dsa-reverse-linked-list",
    "name": "Reverse Linked List (Iterative & Recursive)",
    "nameBn": "\u09b2\u09bf\u0999\u09cd\u0995\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f \u09b0\u09bf\u09ad\u09be\u09b0\u09cd\u09b8 (\u0987\u099f\u09be\u09b0\u09c7\u099f\u09bf\u09ad \u0993 \u09b0\u09bf\u0995\u09be\u09b0\u09cd\u09b8\u09bf\u09ad)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/reverse-linked-list/",
    "difficulty": "EASY",
    "company": "Therap (BD)",
    "tags": [
      "Linked List",
      "Recursion",
      "Pointers"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Linked Lists & Pointers",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Maintain three pointers: prev = null, curr = head, next. In a loop, save next = curr.next, reverse curr.next = prev, advance prev = curr and curr = next. Return prev when curr reaches null.",
    "solutionBn": "\u09a4\u09bf\u09a8\u099f\u09bf \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 (prev, curr, next) \u09a6\u09bf\u09df\u09c7 \u0995\u09be\u099c \u0995\u09b0\u09c1\u09a8\u0964 curr.next \u0995\u09c7 prev \u098f\u09b0 \u09a6\u09bf\u0995\u09c7 \u0998\u09c1\u09b0\u09bf\u09df\u09c7 \u09a6\u09bf\u09a8 \u098f\u09ac\u0982 \u0995\u09cd\u09b0\u09ae\u09be\u09a8\u09cd\u09ac\u09df\u09c7 \u09aa\u09df\u09c7\u09a8\u09cd\u099f\u09be\u09b0 \u098f\u0997\u09bf\u09df\u09c7 \u09a8\u09bf\u09a8\u0964 curr \u09a8\u09be\u09b2 \u09b9\u09b2\u09c7 prev \u09b9\u09ac\u09c7 \u09a8\u09a4\u09c1\u09a8 \u09b9\u09c7\u09a1\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1) iterative",
    "solutionCode": "public ListNode ReverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while (curr != null) {\n        var next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}"
  },
  {
    "id": "dsa-linked-list-cycle",
    "name": "Linked List Cycle Detection (Floyd's Tortoise & Hare)",
    "nameBn": "\u09b2\u09bf\u0999\u09cd\u0995\u09a1 \u09b2\u09bf\u09b8\u09cd\u099f\u09c7 \u09b8\u09be\u0987\u0995\u09c7\u09b2 \u09a8\u09bf\u09b0\u09cd\u09a3\u09af\u09bc (\u09ab\u09cd\u09b2\u09af\u09bc\u09c7\u09a1\u09c7\u09b0 \u0996\u09b0\u0997\u09cb\u09b6 \u0993 \u0995\u099a\u09cd\u099b\u09aa \u0985\u09cd\u09af\u09be\u09b2\u0997\u09b0\u09bf\u09a6\u09ae)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/linked-list-cycle/",
    "difficulty": "EASY",
    "company": "Enosis Solutions",
    "tags": [
      "Linked List",
      "Two Pointers",
      "Floyd Cycle"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Pointers & Cycle Finding",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Advance slow pointer by 1 step and fast pointer by 2 steps. If a loop exists, fast will inevitably lap slow and slow == fast will evaluate to true. If fast or fast.next reaches null, no cycle exists.",
    "solutionBn": "\u0995\u099a\u09cd\u099b\u09aa \u09e7 \u09a7\u09be\u09aa \u098f\u09ac\u0982 \u0996\u09b0\u0997\u09cb\u09b6 \u09e8 \u09a7\u09be\u09aa \u0995\u09b0\u09c7 \u098f\u0997\u09bf\u09df\u09c7 \u099a\u09b2\u09c7\u0964 \u09af\u09a6\u09bf \u09b2\u09bf\u09b8\u09cd\u099f\u09c7 \u09b8\u09be\u0987\u0995\u09c7\u09b2 \u09a5\u09be\u0995\u09c7, \u09a4\u09ac\u09c7 \u0996\u09b0\u0997\u09cb\u09b6 \u098f\u0995\u09aa\u09b0\u09cd\u09af\u09be\u09af\u09bc\u09c7 \u0995\u099a\u09cd\u099b\u09aa\u0995\u09c7 \u09a7\u09b0\u09c7 \u09ab\u09c7\u09b2\u09ac\u09c7 (slow == fast)\u0964 \u0986\u09b0 \u09b8\u09be\u0987\u0995\u09c7\u09b2 \u09a8\u09be \u09a5\u09be\u0995\u09b2\u09c7 \u0996\u09b0\u0997\u09cb\u09b6 \u09a8\u09be\u09b2 \u09aa\u09c7\u09df\u09c7 \u09a5\u09c7\u09ae\u09c7 \u09af\u09be\u09ac\u09c7\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public bool HasCycle(ListNode head) {\n    var slow = head; var fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next; fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}"
  },
  {
    "id": "dsa-invert-binary-tree",
    "name": "Invert Binary Tree",
    "nameBn": "\u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u099f\u09cd\u09b0\u09bf \u0987\u09a8\u09ad\u09be\u09b0\u09cd\u099f (\u09ac\u09be\u09ae \u0993 \u09a1\u09be\u09a8 \u09b6\u09be\u0996\u09be \u0985\u09a6\u09b2\u09ac\u09a6\u09b2)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/invert-binary-tree/",
    "difficulty": "EASY",
    "company": "Brain Station 23",
    "tags": [
      "Tree",
      "DFS",
      "BFS",
      "Binary Tree"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Binary Trees & Traversal",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Recursively swap root.left and root.right, then recurse on the children. Base case: return null if root is null.",
    "solutionBn": "\u09b0\u09c1\u099f \u09a8\u09cb\u09a1\u09c7\u09b0 \u09ac\u09be\u09ae \u0993 \u09a1\u09be\u09a8 \u099a\u09be\u0987\u09b2\u09cd\u09a1 \u0985\u09a6\u09b2\u09ac\u09a6\u09b2 \u0995\u09b0\u09c1\u09a8 \u098f\u09ac\u0982 \u09b0\u09bf\u0995\u09be\u09b0\u09cd\u09b8\u09a8\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09b8\u09be\u09ac\u099f\u09cd\u09b0\u09bf\u09a4\u09c7\u0993 \u098f\u0995\u0987 \u0995\u09be\u099c \u0995\u09b0\u09c1\u09a8\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H) where H is tree height",
    "solutionCode": "public TreeNode InvertTree(TreeNode root) {\n    if (root == null) return null;\n    var temp = root.left; root.left = InvertTree(root.right); root.right = InvertTree(temp);\n    return root;\n}"
  },
  {
    "id": "dsa-lowest-common-ancestor",
    "name": "Lowest Common Ancestor (LCA) in a Binary Tree",
    "nameBn": "\u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u099f\u09cd\u09b0\u09bf\u09a4\u09c7 \u09b2\u09cb\u09af\u09bc\u09c7\u09b8\u09cd\u099f \u0995\u09ae\u09a8 \u0985\u09cd\u09af\u09be\u09a8\u09b8\u09c7\u09b8\u09cd\u099f\u09b0 (LCA)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Tree",
      "DFS",
      "Binary Tree",
      "Recursion"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Tree Algorithms",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Post-order DFS traversal. If root matches p or q, return root. Recurse left and right. If both return non-null, root is the LCA. If only one branch returns non-null, pass that result up.",
    "solutionBn": "DFS \u099a\u09be\u09b2\u09bf\u09df\u09c7 p \u09ac\u09be q \u09aa\u09be\u0993\u09df\u09be \u0997\u09c7\u09b2\u09c7 \u09a8\u09cb\u09a1\u099f\u09bf \u09b0\u09bf\u099f\u09be\u09b0\u09cd\u09a8 \u0995\u09b0\u09c1\u09a8\u0964 \u09ac\u09be\u09ae \u0993 \u09a1\u09be\u09a8 \u0989\u09ad\u09df \u09aa\u09be\u09b6 \u09a5\u09c7\u0995\u09c7 \u09a8\u09cb\u09a1 \u09aa\u09be\u0993\u09df\u09be \u0997\u09c7\u09b2\u09c7 \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09b0\u09c1\u099f \u09a8\u09cb\u09a1\u099f\u09bf\u0987 \u09a4\u09be\u09a6\u09c7\u09b0 \u0995\u09ae\u09a8 \u0985\u09cd\u09af\u09be\u09a8\u09b8\u09c7\u09b8\u09cd\u099f\u09b0\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(H)",
    "solutionCode": "public TreeNode LowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n    if (root == null || root == p || root == q) return root;\n    var left = LowestCommonAncestor(root.left, p, q);\n    var right = LowestCommonAncestor(root.right, p, q);\n    return (left != null && right != null) ? root : (left ?? right);\n}"
  },
  {
    "id": "dsa-climbing-stairs",
    "name": "Climbing Stairs (Fibonacci DP)",
    "nameBn": "\u09b8\u09bf\u0981\u09a1\u09bc\u09bf \u09ac\u09c7\u09af\u09bc\u09c7 \u0993\u09a0\u09be (\u09ab\u09bf\u09ac\u09cb\u09a8\u09be\u099a\u09cd\u099a\u09bf \u09a1\u09bf\u09aa\u09bf)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/climbing-stairs/",
    "difficulty": "EASY",
    "company": "BJIT Group",
    "tags": [
      "Dynamic Programming",
      "Math",
      "Fibonacci"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Dynamic Programming Concepts",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Ways to reach step n is dp[n] = dp[n - 1] + dp[n - 2]. Optimize space to O(1) by maintaining two variables (prev1 and prev2).",
    "solutionBn": "n \u09a4\u09ae \u09a7\u09be\u09aa\u09c7 \u09aa\u09cc\u0981\u099b\u09be\u09a8\u09cb\u09b0 \u0989\u09aa\u09be\u09df \u09b8\u0982\u0996\u09cd\u09af\u09be \u09b9\u09b2\u09cb (n-1) \u098f\u09ac\u0982 (n-2) \u09a7\u09be\u09aa\u09c7\u09b0 \u09b8\u09ae\u09b7\u09cd\u099f\u09bf\u0964 \u09ae\u09be\u09a4\u09cd\u09b0 \u09a6\u09c1\u099f\u09bf \u09ad\u09c7\u09b0\u09bf\u09af\u09bc\u09c7\u09ac\u09b2 \u09a6\u09bf\u09df\u09c7 O(1) \u09b8\u09cd\u09aa\u09c7\u09b8\u09c7 \u09b8\u09ae\u09be\u09a7\u09be\u09a8 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(1)",
    "solutionCode": "public int ClimbStairs(int n) {\n    if (n <= 2) return n;\n    int a = 1, b = 2;\n    for (int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }\n    return b;\n}"
  },
  {
    "id": "dsa-longest-increasing-subsequence",
    "name": "Longest Increasing Subsequence (Patience Sorting in O(N log N))",
    "nameBn": "\u09b2\u0999\u09cd\u0997\u09c7\u09b8\u09cd\u099f \u0987\u09a8\u0995\u09cd\u09b0\u09bf\u099c\u09bf\u0982 \u09b8\u09be\u09ac\u09b8\u09bf\u0995\u09cb\u09af\u09bc\u09c7\u09a8\u09cd\u09b8 (O(N log N) \u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u09b8\u09be\u09b0\u09cd\u099a \u09b8\u09ae\u09be\u09a7\u09be\u09a8)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/longest-increasing-subsequence/",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Dynamic Programming",
      "Binary Search",
      "Patience Sorting"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Advanced Dynamic Programming",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Maintain an array tails where tails[i] stores the smallest tail of all increasing subsequences of length i + 1. For each number, binary search its insertion position in tails. If larger than all, append; otherwise replace the existing value. Total time: O(N log N).",
    "solutionBn": "\u09aa\u09c7\u09b6\u09c7\u09a8\u09cd\u09b8 \u09b8\u09b0\u09cd\u099f\u09bf\u0982 \u098f\u09ac\u0982 \u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u09b8\u09be\u09b0\u09cd\u099a \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 tails \u0985\u09cd\u09af\u09be\u09b0\u09c7 \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09be \u09b9\u09df\u0964 \u09aa\u09cd\u09b0\u09a4\u09bf\u099f\u09bf \u09b8\u0982\u0996\u09cd\u09af\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u09ac\u09be\u0987\u09a8\u09be\u09b0\u09bf \u09b8\u09be\u09b0\u09cd\u099a \u09a6\u09bf\u09df\u09c7 \u09aa\u099c\u09bf\u09b6\u09a8 \u0996\u09c1\u0981\u099c\u09c7 \u09ae\u09be\u09a8 \u09aa\u09cd\u09b0\u09a4\u09bf\u09b8\u09cd\u09a5\u09be\u09aa\u09a8 \u09ac\u09be \u09af\u09cb\u0997 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u09b8\u09ae\u09df: O(N log N)\u0964",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(N)",
    "solutionCode": "public int LengthOfLIS(int[] nums) {\n    var tails = new List<int>();\n    foreach (var x in nums) {\n        int idx = tails.BinarySearch(x);\n        if (idx < 0) idx = ~idx;\n        if (idx == tails.Count) tails.Add(x);\n        else tails[idx] = x;\n    }\n    return tails.Count;\n}"
  },
  {
    "id": "dsa-course-schedule",
    "name": "Course Schedule (Topological Sort / Kahn's Algorithm)",
    "nameBn": "\u0995\u09cb\u09b0\u09cd\u09b8 \u09b6\u09bf\u09a1\u09bf\u0989\u09b2 (\u099f\u09aa\u09cb\u09b2\u099c\u09bf\u0995\u09cd\u09af\u09be\u09b2 \u09b8\u09b0\u09cd\u099f \u0993 \u09b8\u09be\u0987\u0995\u09c7\u09b2 \u09b8\u09a8\u09be\u0995\u09cd\u09a4\u0995\u09b0\u09a3)",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/course-schedule/",
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Graph",
      "Topological Sort",
      "BFS",
      "Kahn Algorithm"
    ],
    "subjectSlug": "dsa",
    "subjectName": "Data Structures & Algorithms",
    "appearsIn": [
      {
        "title": "Graph Traversal & BFS/DFS",
        "url": "/subjects/dsa"
      }
    ],
    "solutionEn": "Build an adjacency list and in-degree array. Push all courses with in-degree == 0 into a queue. As each course is popped, decrement in-degree for its dependent courses. If a neighbor reaches 0, push it. If processed courses == numCourses, completion is possible (DAG); otherwise a cycle exists.",
    "solutionBn": "\u0987\u09a8-\u09a1\u09bf\u0997\u09cd\u09b0\u09c0 \u098f\u09ac\u0982 \u0997\u09cd\u09b0\u09be\u09ab \u09a4\u09c8\u09b0\u09bf \u0995\u09b0\u09c1\u09a8\u0964 \u09af\u09c7\u0997\u09c1\u09b2\u09cb\u09b0 \u0987\u09a8-\u09a1\u09bf\u0997\u09cd\u09b0\u09c0 \u09e6 \u09b8\u09c7\u0997\u09c1\u09b2\u09cb\u0995\u09c7 \u0995\u09bf\u0989\u09a4\u09c7 \u09a8\u09bf\u09a8\u0964 \u0995\u09bf\u0989 \u09a5\u09c7\u0995\u09c7 \u09ac\u09c7\u09b0 \u0995\u09b0\u09c7 \u09aa\u09cd\u09b0\u09a4\u09bf\u09ac\u09c7\u09b6\u09c0\u09a6\u09c7\u09b0 \u0987\u09a8-\u09a1\u09bf\u0997\u09cd\u09b0\u09c0 \u0995\u09ae\u09be\u09a8 \u098f\u09ac\u0982 \u09e6 \u09b9\u09b2\u09c7 \u0995\u09bf\u0989\u09a4\u09c7 \u09a6\u09bf\u09a8\u0964 \u09b8\u09ac \u0995\u09cb\u09b0\u09cd\u09b8 \u09aa\u09cd\u09b0\u09b8\u09c7\u09b8 \u09b9\u09b2\u09c7 \u09b8\u09be\u0987\u0995\u09c7\u09b2 \u09a8\u09c7\u0987, \u0985\u09a8\u09cd\u09af\u09a5\u09be\u09df \u09b8\u09be\u0987\u0995\u09c7\u09b2\u09c7\u09b0 \u0995\u09be\u09b0\u09a3\u09c7 \u0995\u09cb\u09b0\u09cd\u09b8 \u09b6\u09c7\u09b7 \u0995\u09b0\u09be \u0985\u09b8\u09ae\u09cd\u09ad\u09ac\u0964",
    "timeComplexity": "O(V + E)",
    "spaceComplexity": "O(V + E)",
    "solutionCode": "// Kahn's BFS Algorithm with in-degree array"
  },
  {
    "id": "db-nth-highest-salary",
    "name": "Nth Highest Salary Function in PostgreSQL",
    "nameBn": "\u09aa\u09cb\u09b8\u09cd\u099f\u0997\u09cd\u09b0\u09c7\u09b8\u09c7 N-\u09a4\u09ae \u09b8\u09b0\u09cd\u09ac\u09cb\u099a\u09cd\u099a \u09ac\u09c7\u09a4\u09a8 \u09a8\u09bf\u09b0\u09cd\u09a3\u09af\u09bc\u09c7\u09b0 \u09ab\u09be\u0982\u09b6\u09a8",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/nth-highest-salary/",
    "difficulty": "MEDIUM",
    "company": "Enosis Solutions",
    "tags": [
      "SQL",
      "Stored Procedure",
      "PostgreSQL",
      "Window Functions"
    ],
    "subjectSlug": "database",
    "subjectName": "Database using PostgreSQL",
    "appearsIn": [
      {
        "title": "SQL Queries & Indexing",
        "url": "/subjects/database"
      }
    ],
    "solutionEn": "In PL/pgSQL: DECLARE M INT := N - 1; RETURN QUERY SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET M; Or use DENSE_RANK() OVER (ORDER BY salary DESC) in a subquery filtering on rank == N.",
    "solutionBn": "OFFSET N-1 LIMIT 1 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 \u0985\u09a5\u09ac\u09be DENSE_RANK() \u0989\u0987\u09a8\u09cd\u09a1\u09cb \u09ab\u09be\u0982\u09b6\u09a8 \u09a6\u09bf\u09df\u09c7 N-\u09a4\u09ae \u09ac\u09c7\u09a4\u09a8 \u09a8\u09bf\u09b0\u09cd\u09ac\u09be\u099a\u09a8 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(N log N)",
    "spaceComplexity": "O(1)",
    "solutionCode": "CREATE OR REPLACE FUNCTION getNthHighestSalary(N INT) RETURNS TABLE (Salary INT) AS $$\nBEGIN\n  RETURN QUERY\n  SELECT DISTINCT e.salary\n  FROM Employee e\n  ORDER BY e.salary DESC\n  LIMIT 1 OFFSET GREATEST(0, N - 1);\nEND;\n$$ LANGUAGE plpgsql;"
  },
  {
    "id": "db-consecutive-numbers",
    "name": "Consecutive Numbers Appearing at Least Three Times",
    "nameBn": "\u099f\u09be\u09a8\u09be \u09a4\u09bf\u09a8\u09ac\u09be\u09b0 \u0986\u09b8\u09be \u09b8\u0982\u0996\u09cd\u09af\u09be \u09a8\u09bf\u09b0\u09cd\u09ac\u09be\u099a\u09a8",
    "source": "LeetCode",
    "sourceAbbr": "LC",
    "url": "https://leetcode.com/problems/consecutive-numbers/",
    "difficulty": "MEDIUM",
    "company": "Therap (BD)",
    "tags": [
      "SQL",
      "Window Functions",
      "LEAD",
      "LAG"
    ],
    "subjectSlug": "database",
    "subjectName": "Database using PostgreSQL",
    "appearsIn": [
      {
        "title": "SQL Windows & Analytics",
        "url": "/subjects/database"
      }
    ],
    "solutionEn": "Use LAG() and LEAD() analytic window functions: SELECT DISTINCT num FROM (SELECT num, LAG(num) OVER (ORDER BY id) as prev, LEAD(num) OVER (ORDER BY id) as next FROM Logs) t WHERE num = prev AND num = next;",
    "solutionBn": "LAG() \u0993 LEAD() \u0989\u0987\u09a8\u09cd\u09a1\u09cb \u09ab\u09be\u0982\u09b6\u09a8 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09c7 \u09aa\u09c2\u09b0\u09cd\u09ac\u09ac\u09b0\u09cd\u09a4\u09c0 \u0993 \u09aa\u09b0\u09ac\u09b0\u09cd\u09a4\u09c0 \u09b8\u09be\u09b0\u09bf\u09b0 \u09ae\u09be\u09a8 \u09af\u09be\u099a\u09be\u0987 \u0995\u09b0\u09be \u09af\u09be\u09df\u0964 \u0989\u09ad\u09df \u09ae\u09be\u09a8 \u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09ae\u09be\u09a8\u09c7\u09b0 \u09b8\u09ae\u09be\u09a8 \u09b9\u09b2\u09c7 \u09a4\u09be \u099f\u09be\u09a8\u09be \u09e9 \u09ac\u09be\u09b0 \u098f\u09b8\u09c7\u099b\u09c7\u0964",
    "timeComplexity": "O(N)",
    "spaceComplexity": "O(N) window buffer",
    "solutionCode": "WITH Ranked AS (\n  SELECT num, \n         LAG(num, 1) OVER (ORDER BY id) as p1,\n         LAG(num, 2) OVER (ORDER BY id) as p2\n  FROM Logs\n)\nSELECT DISTINCT num AS ConsecutiveNums FROM Ranked WHERE num = p1 AND num = p2;"
  },
  {
    "id": "cs-records-vs-classes",
    "name": "C# 9+ Records vs Classes: Value-based Equality & with Expressions",
    "nameBn": "C# \u09b0\u09c7\u0995\u09b0\u09cd\u09a1 \u09ac\u09a8\u09be\u09ae \u0995\u09cd\u09b2\u09be\u09b8: \u09ad\u09cd\u09af\u09be\u09b2\u09c1 \u09ac\u09c7\u09b8\u09a1 \u09b8\u09ae\u09a4\u09be \u0993 \u0989\u0987\u09a5 \u098f\u0995\u09cd\u09b8\u09aa\u09cd\u09b0\u09c7\u09b6\u09a8",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "Brain Station 23",
    "tags": [
      "C#",
      "Immutability",
      "Clean Architecture",
      "OOP"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "Type System & Records",
        "url": "/subjects/csharp"
      }
    ],
    "solutionEn": "Classes use reference equality (two distinct instances with identical properties compare false). Records automatically implement value-based equality, synthesize Equals, GetHashCode, PrintMembers, and non-destructive mutation via the 'with' keyword (e.g. var updated = person with { Age = 25 }). Ideal for DTOs and Domain Events.",
    "solutionBn": "\u0995\u09cd\u09b2\u09be\u09b8\u09c7 \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09a8\u09cd\u09b8 \u09b8\u09ae\u09a4\u09be \u09a6\u09c7\u0996\u09be \u09b9\u09df, \u0995\u09bf\u09a8\u09cd\u09a4\u09c1 \u09b0\u09c7\u0995\u09b0\u09cd\u09a1\u09c7 \u09aa\u09cd\u09b0\u09aa\u09be\u09b0\u09cd\u099f\u09bf\u09b0 \u09ae\u09be\u09a8 \u09b8\u09ae\u09be\u09a8 \u09b9\u09b2\u09c7 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u09b8\u09ae\u09be\u09a8 \u09ac\u09bf\u09ac\u09c7\u099a\u09bf\u09a4 \u09b9\u09df\u0964 \u09b8\u09be\u09a5\u09c7 'with' \u098f\u0995\u09cd\u09b8\u09aa\u09cd\u09b0\u09c7\u09b6\u09a8\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u0987\u09ae\u09bf\u0989\u099f\u09c7\u09ac\u09b2 \u0985\u09ac\u099c\u09c7\u0995\u09cd\u099f \u0995\u09aa\u09bf \u0995\u09b0\u09c7 \u0995\u09bf\u099b\u09c1 \u09ae\u09be\u09a8 \u0986\u09aa\u09a1\u09c7\u099f \u0995\u09b0\u09be \u09af\u09be\u09df\u0964",
    "timeComplexity": "O(P) where P is property count",
    "spaceComplexity": "O(1)",
    "solutionCode": "public record UserDto(string Name, string Email, int Age);\nvar u1 = new UserDto(\"Kamal\", \"k@bd.com\", 24);\nvar u2 = u1 with { Age = 25 }; // Non-destructive mutation"
  },
  {
    "id": "cs-span-memory-zero-alloc",
    "name": "Span<T> and Memory<T> for High-Performance Zero-Allocation Code",
    "nameBn": "Span<T> \u0993 Memory<T>: \u099c\u09bf\u09b0\u09cb-\u0985\u09cd\u09af\u09be\u09b2\u09cb\u0995\u09c7\u09b6\u09a8 \u09b9\u09be\u0987-\u09aa\u09be\u09b0\u09ab\u09b0\u09ae\u09cd\u09af\u09be\u09a8\u09cd\u09b8 \u0995\u09cb\u09a1\u09bf\u0982",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "C#",
      "Performance",
      "Memory",
      "Span"
    ],
    "subjectSlug": "csharp",
    "subjectName": "Programming in C#",
    "appearsIn": [
      {
        "title": "Memory Optimization & Stack",
        "url": "/subjects/csharp/memory-stack"
      }
    ],
    "solutionEn": "Span<T> is a ref struct representing a contiguous region of arbitrary memory (stack, heap, or unmanaged native memory) with zero copy and zero heap allocations. Because it is a ref struct, it cannot be stored in fields of normal classes or used across await points. Memory<T> is a heap-safe wrapper that can survive across asynchronous calls and yield Spans via .Span.",
    "solutionBn": "Span<T> \u09b9\u09b2\u09cb \u09b8\u09cd\u099f\u09cd\u09af\u09be\u0995-\u0985\u09a8\u09b2\u09bf \u09b0\u09c7\u09ab\u09be\u09b0\u09c7\u09a8\u09cd\u09b8 \u09b8\u09cd\u099f\u09cd\u09b0\u09be\u0995\u09cd\u099f \u09af\u09be \u09af\u09c7\u0995\u09cb\u09a8\u09cb \u0995\u09a8\u09cd\u099f\u09bf\u09a8\u09bf\u0989\u09af\u09bc\u09be\u09b8 \u09ae\u09c7\u09ae\u09cb\u09b0\u09bf\u09b0 \u0989\u0987\u09a8\u09cd\u09a1\u09cb \u09b9\u09bf\u09b8\u09c7\u09ac\u09c7 \u0995\u09be\u099c \u0995\u09b0\u09c7 \u0995\u09cb\u09a8\u09cb \u09b9\u09bf\u09aa \u0985\u09cd\u09af\u09be\u09b2\u09cb\u0995\u09c7\u09b6\u09a8 \u09ac\u09be \u0995\u09aa\u09bf \u099b\u09be\u09dc\u09be\u0987\u0964 \u0985\u09cd\u09af\u09be\u09b8\u09bf\u09a8\u0995\u09cd\u09b0\u09cb\u09a8\u09be\u09b8 \u0995\u09cb\u09a1\u09c7 await \u098f\u09b0 \u09aa\u09b0\u09c7 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u09c7\u09b0 \u099c\u09a8\u09cd\u09af Memory<T> \u09ac\u09cd\u09af\u09ac\u09b9\u09c3\u09a4 \u09b9\u09df\u0964",
    "timeComplexity": "O(1) slicing without memory copying",
    "spaceComplexity": "0 heap bytes allocated",
    "solutionCode": "ReadOnlySpan<char> text = \"2026-09-12\";\nReadOnlySpan<char> year = text.Slice(0, 4); // Zero-allocation slice!\nint parsedYear = int.Parse(year);"
  },
  {
    "id": "sys-distributed-cache",
    "name": "Design a Distributed Caching System (Cache-Aside, Write-Through, LRU)",
    "nameBn": "\u09a1\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ac\u09bf\u0989\u099f\u09c7\u09a1 \u0995\u09cd\u09af\u09be\u09b6\u09bf\u0982 \u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09ae \u09a1\u09bf\u099c\u09be\u0987\u09a8 (\u0995\u09cd\u09af\u09be\u09b6-\u0985\u09cd\u09af\u09be\u09b8\u09be\u0987\u09a1, \u09b0\u09be\u0987\u099f-\u09a5\u09cd\u09b0\u09c1)",
    "source": "BD Tech Interview",
    "sourceAbbr": "SYS",
    "url": null,
    "difficulty": "HARD",
    "company": "Pathao",
    "tags": [
      "System Design",
      "Caching",
      "Redis",
      "Distributed Systems"
    ],
    "subjectSlug": "system-design",
    "subjectName": "System Design",
    "appearsIn": [
      {
        "title": "Scalability & Caching",
        "url": "/subjects/system-design"
      }
    ],
    "solutionEn": "1. Cache-Aside: App checks Redis; if cache miss, reads from DB and populates cache with TTL. 2. Write-Through: Writes update cache and DB simultaneously. 3. Handling Stampede / Thundering Herd: Use distributed mutexes or probabilistic early expiration (XFetch algorithm) to prevent thousands of concurrent DB hits when a popular key expires.",
    "solutionBn": "\u0995\u09cd\u09af\u09be\u09b6-\u0985\u09cd\u09af\u09be\u09b8\u09be\u0987\u09a1 \u09aa\u09cd\u09af\u09be\u099f\u09be\u09b0\u09cd\u09a8\u09c7 \u09aa\u09cd\u09b0\u09a5\u09ae\u09c7 \u0995\u09cd\u09af\u09be\u09b6 \u099a\u09c7\u0995 \u0995\u09b0\u09be \u09b9\u09df, \u09ae\u09bf\u09b8 \u09b9\u09b2\u09c7 \u09a1\u09be\u099f\u09be\u09ac\u09c7\u099c \u09a5\u09c7\u0995\u09c7 \u098f\u09a8\u09c7 \u0995\u09cd\u09af\u09be\u09b6\u09c7 \u09b0\u09be\u0996\u09be \u09b9\u09df\u0964 \u09a5\u09be\u09a8\u09cd\u09a1\u09be\u09b0\u09bf\u0982 \u09b9\u09be\u09b0\u09cd\u09a1 \u09ac\u09be \u0995\u09cd\u09af\u09be\u09b6 \u09b8\u09cd\u099f\u09cd\u09af\u09be\u09ae\u09cd\u09aa\u09bf\u09a1 \u09b0\u09cb\u09a7 \u0995\u09b0\u09a4\u09c7 \u09a1\u09bf\u09b8\u09cd\u099f\u09cd\u09b0\u09bf\u09ac\u09bf\u0989\u099f\u09c7\u09a1 \u09b2\u0995 \u09ac\u09be \u09aa\u09cd\u09b0\u09cb\u09ac\u09be\u09ac\u09bf\u09b2\u09bf\u09b8\u09cd\u099f\u09bf\u0995 \u0986\u09b0\u09cd\u09b2\u09bf \u098f\u0995\u09cd\u09b8\u09aa\u09be\u09af\u09bc\u09be\u09b0 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be \u09b9\u09df\u0964",
    "timeComplexity": "O(1) cache access (<2ms latency)",
    "spaceComplexity": "O(Cached Keys)",
    "solutionCode": "// Cache-Aside pattern with atomic check and distributed lock on miss"
  },
  {
    "id": "sys-whatsapp-chat",
    "name": "Design a Real-Time Chat System (WhatsApp / Messenger) with WebSockets",
    "nameBn": "\u09b0\u09bf\u09af\u09bc\u09c7\u09b2-\u099f\u09be\u0987\u09ae \u099a\u09cd\u09af\u09be\u099f \u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09ae \u09a1\u09bf\u099c\u09be\u0987\u09a8 (\u0993\u09af\u09bc\u09c7\u09ac\u09b8\u0995\u09c7\u099f \u0993 \u09ae\u09c7\u09b8\u09c7\u099c \u09ac\u09cd\u09b0\u09cb\u0995\u09be\u09b0)",
    "source": "BD Tech Interview",
    "sourceAbbr": "SYS",
    "url": null,
    "difficulty": "HARD",
    "company": "Samsung R&D",
    "tags": [
      "System Design",
      "WebSockets",
      "Kafka",
      "Cassandra"
    ],
    "subjectSlug": "system-design",
    "subjectName": "System Design",
    "appearsIn": [
      {
        "title": "Distributed Systems & Scalability",
        "url": "/subjects/system-design"
      }
    ],
    "solutionEn": "Maintain persistent bidirectional WebSocket connections to Chat Gateway servers. When User A sends a message to User B, gateway publishes to Kafka. Message Consumer checks Redis Session Registry to find which gateway server holds User B's active socket and routes it. Messages are persisted to Cassandra/ScyllaDB (partition key: chat_id, cluster key: message_id) for high write throughput. If user is offline, send APNs/FCM Push Notification.",
    "solutionBn": "\u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u0995\u09be\u09b0\u09c0\u09b0\u09be \u0993\u09af\u09bc\u09c7\u09ac\u09b8\u0995\u09c7\u099f\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u0997\u09c7\u099f\u0993\u09af\u09bc\u09c7\u09b0 \u09b8\u09be\u09a5\u09c7 \u09af\u09c1\u0995\u09cd\u09a4 \u09a5\u09be\u0995\u09c7\u0964 \u09ac\u09be\u09b0\u09cd\u09a4\u09be \u0986\u09b8\u09b2\u09c7 Kafka \u09a4\u09c7 \u09af\u09be\u09df \u098f\u09ac\u0982 Redis \u098f \u09a5\u09be\u0995\u09be \u09b8\u09c7\u09b6\u09a8 \u099f\u09c7\u09ac\u09bf\u09b2 \u09a5\u09c7\u0995\u09c7 \u09aa\u09cd\u09b0\u09be\u09aa\u0995 \u0995\u09cb\u09a8 \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0\u09c7 \u0986\u099b\u09c7 \u09a4\u09be \u099c\u09c7\u09a8\u09c7 \u09b8\u09b0\u09be\u09b8\u09b0\u09bf \u09aa\u09c1\u09b6 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u09ac\u09be\u09b0\u09cd\u09a4\u09be\u0997\u09c1\u09b2\u09cb \u09b9\u09be\u0987-\u09b0\u09be\u0987\u099f \u09b8\u09cd\u09aa\u09bf\u09a1\u09c7\u09b0 \u099c\u09a8\u09cd\u09af Cassandra \u09a4\u09c7 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09be \u09b9\u09df \u098f\u09ac\u0982 \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u09a5\u09be\u0995\u09b2\u09c7 \u09aa\u09c1\u09b6 \u09a8\u09cb\u099f\u09bf\u09ab\u09bf\u0995\u09c7\u09b6\u09a8 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09df\u0964",
    "timeComplexity": "<50ms end-to-end delivery",
    "spaceComplexity": "High horizontal scalability",
    "solutionCode": "// High-level architecture: WebSockets -> Kafka -> Redis Session -> Cassandra"
  },
  {
    "id": "os-producer-consumer",
    "name": "Producer-Consumer Bounded Buffer with Semaphores & Mutex",
    "nameBn": "\u09aa\u09cd\u09b0\u09a1\u09bf\u0989\u09b8\u09be\u09b0-\u0995\u09a8\u099c\u09bf\u0989\u09ae\u09be\u09b0 \u09aa\u09cd\u09b0\u09ac\u09b2\u09c7\u09ae (\u09b8\u09c7\u09ae\u09be\u09ab\u09cb\u09b0 \u0993 \u09ae\u09bf\u0989\u099f\u09c7\u0995\u09cd\u09b8 \u09a6\u09bf\u09af\u09bc\u09c7 \u09ac\u09be\u09ab\u09be\u09b0 \u09a8\u09bf\u09af\u09bc\u09a8\u09cd\u09a4\u09cd\u09b0\u09a3)",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "MEDIUM",
    "company": "Samsung R&D",
    "tags": [
      "Operating Systems",
      "Concurrency",
      "Semaphores",
      "Mutex"
    ],
    "subjectSlug": "os",
    "subjectName": "Operating Systems",
    "appearsIn": [
      {
        "title": "Concurrency & Memory Paging",
        "url": "/subjects/os"
      }
    ],
    "solutionEn": "Use two counting semaphores: emptySlots = N, fullSlots = 0, and a binary mutex lock. Producer: Wait(emptySlots) -> Acquire(mutex) -> AddItem -> Release(mutex) -> Signal(fullSlots). Consumer: Wait(fullSlots) -> Acquire(mutex) -> RemoveItem -> Release(mutex) -> Signal(emptySlots). Prevents buffer overflow, underflow, and data races.",
    "solutionBn": "\u09a6\u09c1\u099f\u09bf \u09b8\u09c7\u09ae\u09be\u09ab\u09cb\u09b0 (emptySlots \u0993 fullSlots) \u098f\u09ac\u0982 \u098f\u0995\u099f\u09bf \u09ae\u09bf\u0989\u099f\u09c7\u0995\u09cd\u09b8 \u09ac\u09cd\u09af\u09ac\u09b9\u09be\u09b0 \u0995\u09b0\u09be \u09b9\u09df\u0964 \u09aa\u09cd\u09b0\u09a1\u09bf\u0989\u09b8\u09be\u09b0 \u0996\u09be\u09b2\u09bf \u09b8\u09cd\u09b2\u099f\u09c7\u09b0 \u0985\u09aa\u09c7\u0995\u09cd\u09b7\u09be \u0995\u09b0\u09c7 \u09ac\u09be\u09ab\u09be\u09b0\u09c7 \u09a1\u09be\u099f\u09be \u09b0\u09be\u0996\u09c7 \u098f\u09ac\u0982 \u09ab\u09c1\u09b2 \u09b8\u09bf\u0997\u09a8\u09cd\u09af\u09be\u09b2 \u09a6\u09c7\u09df\u0964 \u0995\u09a8\u099c\u09bf\u0989\u09ae\u09be\u09b0 \u09a1\u09be\u099f\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u0985\u09aa\u09c7\u0995\u09cd\u09b7\u09be \u0995\u09b0\u09c7 \u09a1\u09be\u099f\u09be \u0997\u09cd\u09b0\u09b9\u09a3 \u0995\u09b0\u09c7 \u0996\u09be\u09b2\u09bf \u09b8\u09cd\u09b2\u099f \u09b8\u09bf\u0997\u09a8\u09cd\u09af\u09be\u09b2 \u09a6\u09c7\u09df\u0964",
    "timeComplexity": "O(1) enqueue / dequeue",
    "spaceComplexity": "O(N) buffer size",
    "solutionCode": "private readonly SemaphoreSlim _empty = new(10);\nprivate readonly SemaphoreSlim _full = new(0);\nprivate readonly object _lock = new();\n// Channel<T> or BlockingCollection<T> implements this in modern .NET"
  },
  {
    "id": "nw-dns-resolution-flow",
    "name": "Complete DNS Resolution Hierarchy & Anycast Routing",
    "nameBn": "DNS \u09b0\u09c7\u099c\u09cb\u09b2\u09bf\u0989\u09b6\u09a8 \u09a7\u09be\u09aa\u09b8\u09ae\u09c2\u09b9: \u09b0\u09c1\u099f, TLD, \u0985\u09a5\u09b0\u09bf\u099f\u09c7\u099f\u09bf\u09ad \u09a8\u09c7\u09ae\u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u0993 \u098f\u09a8\u09bf\u0995\u09be\u09b8\u09cd\u099f",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "Chaldal",
    "tags": [
      "Networking",
      "DNS",
      "Web Protocols",
      "Infrastructure"
    ],
    "subjectSlug": "networks",
    "subjectName": "Computer Networks",
    "appearsIn": [
      {
        "title": "Networking Protocols & DNS",
        "url": "/subjects/networks"
      }
    ],
    "solutionEn": "1. Browser checks local cache / OS hosts file. 2. Recursive Resolver queries Root DNS server (returns .com TLD server IP). 3. Resolver queries TLD server (returns authoritative nameserver IP). 4. Resolver queries Authoritative nameserver (returns A/AAAA record with IP). 5. Resolver caches record for TTL seconds. Anycast BGP routing directs queries to the geographically closest DNS instance.",
    "solutionBn": "\u09e7. \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0 \u0993 \u0993\u098f\u09b8 \u0995\u09cd\u09af\u09be\u09b6 \u099a\u09c7\u0995\u0964 \u09e8. \u09b0\u09bf\u0995\u09be\u09b0\u09cd\u09b8\u09bf\u09ad \u09b0\u09bf\u099c\u09b2\u09ad\u09be\u09b0 \u09b0\u09c1\u099f \u09a8\u09c7\u09ae\u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0\u0995\u09c7 \u099c\u09bf\u099c\u09cd\u099e\u09c7\u09b8 \u0995\u09b0\u09c7 (TLD \u098f\u09b0 \u09a0\u09bf\u0995\u09be\u09a8\u09be \u09aa\u09be\u09df)\u0964 \u09e9. TLD \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u09a1\u09cb\u09ae\u09c7\u0987\u09a8\u09c7\u09b0 \u0985\u09a5\u09b0\u09bf\u099f\u09c7\u099f\u09bf\u09ad \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0\u09c7\u09b0 \u09a0\u09bf\u0995\u09be\u09a8\u09be \u09a6\u09c7\u09df\u0964 \u09ea. \u0985\u09a5\u09b0\u09bf\u099f\u09c7\u099f\u09bf\u09ad \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u09ae\u09c2\u09b2 \u0986\u0987\u09aa\u09bf \u09aa\u09cd\u09b0\u09a6\u09be\u09a8 \u0995\u09b0\u09c7 \u098f\u09ac\u0982 \u09b0\u09bf\u099c\u09b2\u09ad\u09be\u09b0 \u09a8\u09bf\u09b0\u09cd\u09a6\u09bf\u09b7\u09cd\u099f TTL \u09b8\u09ae\u09df \u09aa\u09b0\u09cd\u09af\u09a8\u09cd\u09a4 \u0995\u09cd\u09af\u09be\u09b6 \u0995\u09b0\u09c7\u0964",
    "timeComplexity": "O(1) with local cache, 50-100ms full query",
    "spaceComplexity": "O(1)",
    "solutionCode": "// DNS lookup converts human domain to machine IPv4/IPv6 address"
  },
  {
    "id": "hr-failure-learning",
    "name": "Tell Me About a Time a Production Bug Occurred and How You Handled It",
    "nameBn": "\u09aa\u09cd\u09b0\u09cb\u09a1\u09be\u0995\u09b6\u09a8\u09c7 \u09ac\u09dc \u09ac\u09be\u0997 \u09ac\u09be \u0986\u0989\u099f\u09c7\u099c \u09b8\u09be\u09ae\u09b2\u09be\u09a8\u09cb\u09b0 \u09ac\u09be\u09b8\u09cd\u09a4\u09ac \u0985\u09ad\u09bf\u099c\u09cd\u099e\u09a4\u09be",
    "source": "BD Tech Interview",
    "sourceAbbr": "INT",
    "url": null,
    "difficulty": "EASY",
    "company": "Therap (BD)",
    "tags": [
      "Behavioral",
      "HR",
      "Post-Mortem",
      "Production"
    ],
    "subjectSlug": "behavioral",
    "subjectName": "Behavioral & HR Round",
    "appearsIn": [
      {
        "title": "HR Viva & Career Growth",
        "url": "/subjects/csharp"
      }
    ],
    "solutionEn": "Structure: 1. Acknowledged issue immediately with transparency without deflecting blame. 2. Executed rollback or safe feature-flag toggle to restore service within 10 minutes. 3. Conducted root cause analysis (RCA) with blameless post-mortem. 4. Implemented automated regression tests and CI/CD validation gates to ensure the failure mode can never occur again.",
    "solutionBn": "\u0995\u09be\u0989\u0995\u09c7 \u09a6\u09cb\u09b7\u09be\u09b0\u09cb\u09aa \u09a8\u09be \u0995\u09b0\u09c7 \u09a6\u09cd\u09b0\u09c1\u09a4 \u09b0\u09cb\u09b2\u09ac\u09cd\u09af\u09be\u0995 \u09ac\u09be \u09ab\u09bf\u099a\u09be\u09b0 \u09ab\u09cd\u09b2\u09cd\u09af\u09be\u0997\u09c7\u09b0 \u09ae\u09be\u09a7\u09cd\u09af\u09ae\u09c7 \u09b8\u09bf\u09b8\u09cd\u099f\u09c7\u09ae \u09b8\u099a\u09b2 \u0995\u09b0\u09c7\u099b\u09bf\u0964 \u098f\u09b0\u09aa\u09b0 \u09ac\u09bf\u09b8\u09cd\u09a4\u09be\u09b0\u09bf\u09a4 \u09b0\u09c1\u099f-\u0995\u099c \u0985\u09cd\u09af\u09be\u09a8\u09be\u09b2\u09be\u0987\u09b8\u09bf\u09b8 (RCA) \u09b2\u09bf\u0996\u09c7 \u09b8\u09cd\u09ac\u09df\u0982\u0995\u09cd\u09b0\u09bf\u09df \u09b0\u09bf\u0997\u09cd\u09b0\u09c7\u09b6\u09a8 \u099f\u09c7\u09b8\u09cd\u099f \u09af\u09cb\u0997 \u0995\u09b0\u09c7\u099b\u09bf \u09af\u09be\u09a4\u09c7 \u09ad\u09ac\u09bf\u09b7\u09cd\u09af\u09a4\u09c7 \u098f\u09ae\u09a8 \u09b8\u09ae\u09b8\u09cd\u09af\u09be \u0986\u09b0 \u0995\u0996\u09a8\u09cb \u09a8\u09be \u0998\u099f\u09c7\u0964",
    "timeComplexity": "Structured 2-minute answer",
    "spaceComplexity": "Demonstrates maturity & leadership",
    "solutionCode": "// Emphasize: Ownership -> Fast Mitigate -> Blameless Post-Mortem -> Long-term Prevention"
  }
];

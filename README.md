# 🎯 ApexPlan

## Project Description
**ApexPlan** is a dynamic web application designed to help users bridge the gap between long-term macro objectives and daily execution. Instead of just listing tasks, ApexPlan introduces a **cascading timeline algorithm**: when a user defines an objective and chains a sequence of micro-goals with fixed durations, the system automatically builds and propagates the entire schedule. 

If a specific goal faces a delay, the user can report it, and the system instantly triggers a chain reaction, recalculating the start and end dates of all subsequent goals as well as the final objective deadline.

To connect high-level planning with daily routines, ApexPlan features an interactive **Weekly Planner (Google Calendar-style)**. Users can drag pending goals from their active timeline directly into specific timeslots of their week and resize them to define hours of deep work.

### Key Features
* **Cascading Schedule Engine:** Automatic calculation and adjustment of sequential dates based on goal durations and reported delays.
* **Smart Progress Tracking:** Intelligent identification of delayed tasks based on current date comparisons.
* **Interactive Weekly Dashboard:** Drag-and-drop and resizable calendar interface powered by Next.js.
* **Robust Backend API:** Data relationships and date mechanics fully processed via Django.
* **Cloud Database Integration:** Real-time data storage using Supabase (PostgreSQL).
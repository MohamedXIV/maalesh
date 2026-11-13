// Maalesh recruiting counter — English
// Effects are explicit whitelisted tags handled by TypeScript.
=== greeting ===
HR: Welcome to Maalesh! We specialize in finding the right person for the wrong job.

+ [Show me today's vacancies.]
    HR: Gladly. The paperwork department asked for someone with extensive sitting experience.
    # intent:jobs
    -> END
+ [Actually, I'm taking a little break.]
    HR: Excellent choice. We'll mark you as professionally unavailable.
    # intent:village
    -> END

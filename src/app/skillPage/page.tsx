

// ABOUT UPDATIONS OF SKILL DATA: 
/*
    REQUIRED FLOW : 
    1. The Skill Page updates and re-calculates the skillMetaData
    2. An updation request is sent to backend for updating the skill data in 
        all the concerned documents.
        (whenever a skill is updated, its metadata has to be updated in the user).
    3. The backend is now enriched with most fresh data.
    4. Backend call for updation of data will only be made where data is updated
    5. No place which only reads the backend data will make a backend call for updation.

    -----------------------------------------------------------------------------------

    DEV FLOW: 
    1. Since the Skill Page is yet to implemented, the skill metadata updation 
        which is supposed to be performed on the skill page is currently being 
        simulated by the populateSkillMetaData() function on the backend.
    2. This function runs at the time of accepting the sampleRoadmap i.e. 
        the acceptRoadmap() controller in controllers/roadmapControllers. 
*/
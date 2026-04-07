const axios = require("axios");

const API_URL = "http://localhost:8000/api/v1";

const test = async () => {
    console.log("🧪 Testing Doctor Login Flow\n");

    try {
        // Test credentials
        const email = "ahmed.hassan.doc@example.com";
        const password = "Doctor@123";

        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}\n`);

        // Step 1: Login
        console.log("1️⃣  Attempting login...");
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
            identifier: email,
            password,
        });

        console.log("✅ Login successful!");
        console.log(`   Status: ${loginResponse.status}`);

        const loginData = loginResponse.data;
        console.log(`   Response has 'success': ${!!loginData.success}`);
        console.log(`   Response has 'data': ${!!loginData.data}`);
        console.log(`   Data has 'token': ${!!loginData.data?.token}`);
        console.log(`   Data has 'user': ${!!loginData.data?.user}`);

        if (!loginData.data?.user) {
            throw new Error("User data not found in response");
        }

        if (!loginData.data?.token) {
            throw new Error("Token not found in response");
        }

        const user = loginData.data.user;
        const token = loginData.data.token;

        console.log(`\n👤 User Data:`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}`);

        if (user.role !== "doctor") {
            throw new Error(`Expected role 'doctor', got '${user.role}'`);
        }

        console.log(`\n🔐 Token: ${token.substring(0, 50)}...`);

        // Step 2: Test authenticated request to doctor dashboard
        console.log(`\n2️⃣  Testing authenticated request to doctor dashboard...`);
        const dashboardResponse = await axios.get(
            `${API_URL}/doctors/dashboard`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("✅ Doctor dashboard fetch successful!");
        console.log(`   Status: ${dashboardResponse.status}`);
        console.log(`   Has doctor data: ${!!dashboardResponse.data?.data?.doctor}`);
        console.log(`   Has stats: ${!!dashboardResponse.data?.data?.stats}`);

        if (dashboardResponse.data?.data?.stats) {
            const stats = dashboardResponse.data.data.stats;
            console.log(`\n📊 Dashboard Stats:`);
            console.log(`   Total Appointments: ${stats.totalAppointments}`);
            console.log(`   Today Appointments: ${stats.todayAppointments}`);
            console.log(`   Upcoming Appointments: ${stats.upcomingAppointments}`);
            console.log(`   Completed Appointments: ${stats.completedAppointments}`);
            console.log(`   Canceled Appointments: ${stats.canceledAppointments}`);
            console.log(`   Unique Patients: ${stats.uniquePatients}`);
        }

        console.log(`\n✅ All tests passed! Login and dashboard access working correctly.`);
        console.log(`\n🎯 You can now login in the browser with:`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error("\n❌ Test failed!");
        console.error(`Error: ${error.message}`);

        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Response:`, error.response.data);
        }

        process.exit(1);
    }
};

test();

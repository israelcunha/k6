**Project to understand & explain how K6 works step by step**

### Prerequisites

**Install K6**

* brew install k6

**Install K6 Others Operating system**

* This Link to instrutions: (https://grafana.com/docs/k6/latest/set-up/install-k6/)

***Check version installed***

* k6 --version

### Running process!*

**Test K6 using the following command:**

**Test K6 using the following command to generate report web:**

* k6 run script_name.js

**Test K6 using the following command to generate report web:**

* K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run requests/apostar.js

* K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run requests/win.js

* K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run requests/balance.js

* K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=report.html k6 run requests/login.js

**Executar com Logs:**
K6_LOG_LEVEL=debug k6 run requests/login.js

## Resources
* API for learning purposes: https://backdev.fds.bet/api

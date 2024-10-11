
        function showTab(tabId) {
            // Hide all tab content
            var tabs = document.getElementsByClassName("tab-content");
            for (var i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove("active");
            }
            // Show the selected tab content
            document.getElementById(tabId).classList.add("active");
        }

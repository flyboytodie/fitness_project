from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console messages
    console_logs = []
    page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
    page.on("pageerror", lambda err: console_logs.append(f"[PAGE ERROR] {err}"))

    # Navigate to the app
    page.goto('http://localhost:8090')
    page.wait_for_load_state('networkidle')

    # Print console logs
    print("=== Console Logs ===")
    for log in console_logs:
        print(log)

    # Take screenshot
    page.screenshot(path='e:/fitness_project/test_home.png', full_page=True)
    print("\nScreenshot saved to test_home.png")

    # Navigate to diet page
    page.click('text=饮食')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)

    # Print console logs after diet page
    print("\n=== Console Logs After Diet Page ===")
    for log in console_logs:
        print(log)

    # Take screenshot of diet page
    page.screenshot(path='e:/fitness_project/test_diet.png', full_page=True)
    print("\nScreenshot saved to test_diet.png")

    # Navigate to body page
    page.click('text=身体')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(500)

    # Print console logs after body page
    print("\n=== Console Logs After Body Page ===")
    for log in console_logs:
        print(log)

    # Take screenshot of body page
    page.screenshot(path='e:/fitness_project/test_body.png', full_page=True)
    print("\nScreenshot saved to test_body.png")

    browser.close()

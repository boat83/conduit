def test_con_download_data():
    import time
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from webdriver_manager.chrome import ChromeDriverManager

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')

    # driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)  # headless
    driver = webdriver.Chrome(ChromeDriverManager().install())

    driver.get('http://localhost:1667/#/login')

    driver.find_element_by_xpath('//fieldset//input[@placeholder="Email"]').send_keys('testuser1@example.com')
    driver.find_element_by_xpath('//fieldset//input[@placeholder="Password"]').send_keys('Abcd123$')
    driver.find_element_by_xpath('//form/button').click()
    time.sleep(2)

    driver.find_element_by_xpath('//div[@class="container"]//ul/li[4]/a').click()

    time.sleep(3)

    my_articles = driver.find_elements_by_xpath('//div[@class="article-preview"]//h1')

    list_of_feed = []
    for row in my_articles:
        list_of_feed.append(row.text)

    with open('list_of_feed.txt', 'a') as x:
        for i in list_of_feed:
            x.write(i + "\n")
            print(i)

    driver.close()

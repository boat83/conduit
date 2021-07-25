import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.common.exceptions import NoSuchElementException

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')

# driver = webdriver.Chrome(ChromeDriverManager().install(), chrome_options=options)  # headless
driver = webdriver.Chrome(ChromeDriverManager().install())

try:
    driver.get('http://localhost:1667/#/')
    ref_text = 'Your registration was successful!'
    driver.find_element_by_xpath('//*[@id="app"]/nav/div/ul/li[3]/a').click()
    time.sleep(2)
    driver.find_element_by_xpath('//input[@placeholder="Username"]').send_keys('JohnDoe')
    driver.find_element_by_xpath('//input[@placeholder="Email"]').send_keys('Johndoe1@vizsgaremek.hu')
    driver.find_element_by_xpath('//input[@placeholder="Password"]').send_keys('Rambo1234++')
    driver.find_element_by_xpath('//*[@id="app"]/div/div/div/div/form/button').click()

    time.sleep(3)
    welcome = driver.find_element_by_xpath('//div[@class="swal-text"]').text

    print(welcome)
    assert ref_text == welcome

    time.sleep(3)

finally:
    pass
    driver.close()

import { test } from '@playwright/test';
import { ContactPage } from '../project objects/contact.po';
import { LoginPage } from '../project objects/login.po';
const testData = require('../fixtures/loginFixture.json');
const contactTestData = require('../fixtures/contactFixture.json');
const{authenticateUser, createEntity}= require('../utils/helper.spec');

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await page.goto('/');
  await login.login(testData.validUser.username, testData.validUser.password);
  await login.verifyValidLogin();
});

test.describe('Contact Test Case', () => {
  test('Contact add test', async ({ page,request }) => {
    const contactPage = new ContactPage(page);
    await contactPage.contactAdd(contactTestData.contact.firstName, contactTestData.contact.lastName, contactTestData.contact.dateOfBirth, contactTestData.contact.email, contactTestData.contact.phone, contactTestData.contact.address, contactTestData.contact.city);
    accessToken= await authenticateUser(testData.validUser.username, testData.validUser.password,{request});
    await deleteEntity(contactTestData.contact, accessToken, '/contacts', { request });
    await validateAccessToken(accessToken);
  });

  test.only('Contact Edit test', async ({ page, request }) => {
    const Data = {
        firstName: "Bipasha",
        lastName: "Maharjan",
        dateOfBirth: "2005-01-05",
        email: "bipasha@gmail.com",
        phone: "987567384",
        address: "Wonde",
        city: "Kathmandu"
    };

    const contact = new ContactPage(page);
    
    const accessToken = await authenticateUser(
      testData.validUser.username,
      testData.validUser.password,
      { request }
    );

    await createEntity(Data, accessToken, '/contacts', { request });
  await page.reload();

  // pass full contact object here
  await ContactPage.viewContact(Data);

  // edit first name
  await ContactPage.contactEdit(contactTestData.contactEdit.firstName);

  // prepare updated object (merge old with new firstName)
  const updatedContact = { ...Data, firstName: contactTestData.contactEdit.firstName };

  test.only('Contact Delete test', async ({ page, request }) => {
    const Data = {
      "firstName": "John",
      "lastName": "doe",
      "birthdate": "1990-06-30",
      "email":"johndoe@gmail.com",
      "country": "Nepal"
    };
    const contact = new ContactPage(page);
    accessToken = await authenticateUser(testData.invalidUser.validUser.userName, testData.validUser.password, { request });
    await createEntity(Data, accessToken, '/contacts', { request });
    page.reload;
    await ContactPage.viewContact();
    const id = await
    await deleteEntity(updatedContact.id, accessToken, '/contacts', { request });
  });

  // validate full object
  await ContactPage.validateContactCreated(updatedContact);
    });

  })
        /*const contact = new ContactPage(page);
        accessToken = await authenticateUser(testData.validUser.username, testData.validUser.password,{request});
         await createEntity(Data, accessToken, '/contacts',{request});
         page.reload();
         await contact.viewContact();
         await contact.contactEdit(contactTestData.contactEdit.firstName);
         await contact.validateContactCreated(contactTestData.contactEdit.firstName,contactTestData.contactEdit.lastName)*/
    





/*import { test } from '@playwright/test';
import { LoginPage } from '../project objects/login.po';
import { ContactPage } from '../project objects/contact.po';
const testData = require('../fixtures/loginFixture.json');
const contactTestData = require('../fixtures/contactFixture.json');

test.beforeEach(async({page}) =>{
    const login = new LoginPage(page);
    await page.goto('/');
    await login.login(testData.validUser.username, testData.validUser.password);
    await login.verifyValidLogin();

})

test.describe('Contact testcase',()=>{
    test('contact Add test', async({page, request})=>{
        const contact = new ContactPage(page);
        await contact.contactAdd(contactTestData.contact.firstName, contactTestData.contact.lastName );
        await contact.viewContact();
        await contact.validateContactCreated(contactTestData.contact.firstName, contactTestData.lastName)
    })
})
*/
/* const { expect } = require("@playwright/test");

exports.ContactPage = class ContactPage {
    constructor(page) {
        this.page = page;

        // Form fields
        this.addContact = '#add-contact';
        this.firstName = '#firstName';
        this.lastName = '#lastName';
        this.dob = 'input[placeholder="yyyy-MM-dd"]';
        this.email = '#email';
        this.phone = '#phone';
        this.address = 'input[placeholder="Address 1"]';
        this.city = '#city';
        this.state = 'input[placeholder="State or Province"]';
        this.postal = '#postal';
        this.country = 'input[placeholder="Country"]';
        this.Save = '#submit';

        // Saved contact view selectors (updated)
        this.savedFirstName = '#saved-firstName';
        this.savedLastName = '#saved-lastName';
        this.savedDOB = '#saved-dob';
        this.savedEmail = '#saved-email';
        this.savedPhone = '#saved-phone';
        this.savedAddress = '#saved-address';
        this.savedCity = '#saved-city';
        this.savedState = '#saved-state';
        this.savedPostal = '#saved-postal';
        this.savedCountry = '#saved-country';

        // Actions
        this.editContact = '#edit-contact';
        this.delete = '#delete';
        this.viewCreatedContact = '#view-contact';
    }

    async contactAdd(firstName, lastName, dateOfBirth, email, phone, address, city, state, postal, country) {
        await this.page.locator(this.addContact).click();
        await this.page.locator(this.firstName).fill(firstName);
        await this.page.locator(this.lastName).fill(lastName);
        await this.page.locator(this.dob).fill(dateOfBirth);
        await this.page.locator(this.email).fill(email);
        await this.page.locator(this.phone).fill(phone);
        await this.page.locator(this.address).fill(address);
        await this.page.locator(this.city).fill(city);
        await this.page.locator(this.state).fill(state);
        // await this.page.locator(this.postal).fill(postal);
        // await this.page.locator(this.country).fill(country);

        await Promise.all([
            this.page.waitForNavigation({ waitUntil: 'load' }),
            this.page.locator(this.Save).click()
        ]);
    }

    async viewContact() {
        await this.page.locator(this.viewCreatedContact).click();
    }

    async validateContactCreated(fName, lName, dob, email, phone, address, city, postal, state, country) {
        await expect(this.page.locator(this.savedFirstName)).toHaveText(fName);
        await expect(this.page.locator(this.savedLastName)).toHaveText(lName);
        await expect(this.page.locator(this.savedDOB)).toHaveText(dob);
        await expect(this.page.locator(this.savedEmail)).toHaveText(email);
        await expect(this.page.locator(this.savedPhone)).toHaveText(phone);
        await expect(this.page.locator(this.savedAddress)).toHaveText(address);
        await expect(this.page.locator(this.savedCity)).toHaveText(city);
        await expect(this.page.locator(this.savedPostal)).toHaveText(postal);
        await expect(this.page.locator(this.savedState)).toHaveText(state);
        await expect(this.page.locator(this.savedCountry)).toHaveText(country);
    }
}*/
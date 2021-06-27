import { gCall } from "../test-utils/gCall";
import { Connection } from "typeorm";
import { testConn } from "../test-utils/testConn"
import faker from "faker";

let conn: Connection;
beforeAll(async () => {
    conn = await testConn();
})

afterAll(async () => {
    await conn.close();
})


/*
  The purpose of this test module is to test all the post functionality related
  to social media mipulation add and delete. 
*/
describe("Product", () => {
    const addSocialMediaMutation = 
      `mutation AddSocialMedia($social_media: String!, $link: String!){
          addSocialMedia(social_media: $social_media, link: $link)
      }`

    it("add without login", async () => {
        const response = await gCall({
            source: addSocialMediaMutation,
            variableValues: {
                social_media: "facebook",
                link: faker.internet.url()
            },
        });

        expect(response).toMatchObject({
            data: {
                addSocialMedia: false
            }
        });
    })


   
})
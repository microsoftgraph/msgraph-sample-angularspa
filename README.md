---
page_type: sample
description: This sample demonstrates how to use the Microsoft Graph JavaScript SDK to access data in Office 365 from Angular single-page applications.
products:
- ms-graph
- microsoft-graph-calendar-api
- office-exchange-online
languages:
- typescript
---

# Microsoft Graph sample Angular app

[![Node.js CI](https://github.com/microsoftgraph/msgraph-training-angularspa/actions/workflows/node.js.yml/badge.svg)](https://github.com/microsoftgraph/msgraph-training-angularspa/actions/workflows/node.js.yml)

This sample demonstrates how to use the Microsoft Graph JavaScript SDK to access data in Office 365 from Angular single-page applications.

> **NOTE:** This sample was originally built from a tutorial published on the [Microsoft Graph tutorials](https://docs.microsoft.com/graph/tutorials) page. That tutorial has been removed.

## Prerequisites

To run the completed project in this folder, you need the following:

- [Node.js](https://nodejs.org) installed on your development machine. If you do not have Node.js, visit the previous link for download options. (**Note:** This tutorial was written with Node version 16.4.2. The steps in this guide may work with other versions, but that has not been tested.)
- [Angular CLI](https://cli.angular.io/) installed on your development machine.
- Either a personal Microsoft account with a mailbox on Outlook.com, or a Microsoft work or school account.

If you don't have a Microsoft account, there are a couple of options to get a free account:

- You can [sign up for a new personal Microsoft account](https://signup.live.com/signup?wa=wsignin1.0&rpsnv=12&ct=1454618383&rver=6.4.6456.0&wp=MBI_SSL_SHARED&wreply=https://mail.live.com/default.aspx&id=64855&cbcxt=mai&bk=1454618383&uiflavor=web&uaid=b213a65b4fdc484382b6622b3ecaa547&mkt=E-US&lc=1033&lic=1).
- You can [sign up for the Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program) to get a free Office 365 subscription.

## Register a web application with the Azure Active Directory admin center

1. Open a browser and navigate to the [Azure Active Directory admin center](https://aad.portal.azure.com). Login using a **personal account** (aka: Microsoft Account) or **Work or School Account**.

1. Select **Azure Active Directory** in the left-hand navigation, then select **App registrations** under **Manage**

1. Select **New registration**. On the **Register an application** page, set the values as follows.

    - Set **Name** to `Angular Graph Sample`.
    - Set **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts**.
    - Under **Redirect URI**, set the first drop-down to `Single-page application (SPA)` and set the value to `http://localhost:4200`.

1. Choose **Register**. On the **Angular Graph Tutorial** page, copy the value of the **Application (client) ID** and save it, you will need it in the next step.

## Configure the sample

1. Rename the `oauth.example.ts` file to `oauth.ts`.
1. Edit the `oauth.ts` file and make the following changes.
    1. Replace `YOUR_APP_ID_HERE` with the **Application Id** you got from the App Registration Portal.
1. In your command-line interface (CLI), navigate to this directory and run the following command to install requirements.

    ```Shell
    npm install
    ```

## Run the sample

1. Run the following command in your CLI to start the application.

    ```Shell
    ng serve
    ```

1. Open a browser and browse to `http://localhost:4200`.

## Code of conduct

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

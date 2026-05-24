---
title: "Understanding Singapore's Payment Stack: From Bank Apps to SGQR, PayNow, FAST, Contactless, and NETS"
slug: understanding-singapore-payment-stack
tags:
  - payments
  - fintech
  - system-design
  - singapore
  - public
  - note
categories:
  - tech
topics:
  - payments
  - system-design
  - singapore-fintech
selected: true
---

Usually we have two kinds of payments, card payment and e-wallet.

Public article: [[Publish/understanding-singapore-payment-stack/index|Understanding Singapore's Payment Stack]]

## Card Payment

The evolution of card technology: [[EMV]]

Card payment processing involve [[Card Schema]] and different card schema will have different workflows.


## e-Wallet

Actually includes [[Apple Pay & Wallet]],  Google Pay & Wallet, Paypal, Wechat Pay, Alipay 

So how to [[Design an e-Wallet System]] like Paypal, Wechat Pay is similar here.



[[IAP]] is kind of different. 
# Payment Gateway

An integration way to integrate multiple PSP.

In Mihoyo, we use this to integrate with card payment method.

Google Pay, IAP and Card payment in one payment_method table.
And Adyen, WorldPay is stored in payment_vendor table.
There is a routing table to decide how much possibility an available payment vendor is returned. 


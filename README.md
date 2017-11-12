LiveNote
Contributors: Ezra Ablaza, Kelvin Liu, Phurushotham Shekar.

LiveNote is a online tool that allows multiple users to collaborate on a shared class note document while maintaining their personal typed notes. The more you contribute, the more access you have to the "master" document (the one that is compiled as the aggregate of everyone's notes).

The program is hosted on Microsoft Azure and was created by using its Databases and Linguistics API and web-hosting. On the site, multiple people can contribute to the "master" version of the notes by either writing their notes or editing the small version of the "master" they are given. The more they contribute, the more of the master they can see. When multiple people write notes as the professor is speaking, the program automatically splits the sentences into phrases such as Noun Phrase and Verb Phrase using the Linguistics API. Then, we used our own algorithm to merge these phrases and compile the sentence back together. \

There will be some unusual formatting or word errors in the "master", so those who decide to contribute by editing can revise the portion they are given for content and grammar. Then, they will be given access to an ever-increasing amount.

The front end uses sockets.io to divide up the master into "Domains" which are the small parts of the "master" that is visible to the users. It also contains all of the html and css that make the site look nice and work as intended.

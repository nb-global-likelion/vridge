1.

- route: app/(dashboard)/candidate/profile
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=323-1107&m=dev
- description: profile of the candidate
- current state: is being redirected by proxy, edit button does not exist

2.

- route: app/candidate/[slug]
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=283-2572&m=dev
- description: public profile of the candidate
- current state: i18n related issue

3.

- route: app/(dashboard)/candidate/profile/edit
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=323-560&m=dev , https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=323-783&m=dev
- description: edit mode of profile of the candidate
- current state: is not linked from profile page

  3.1.

- DS components backlog (deferred from item #3): https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=378-439&m=dev
- DS related nodes: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3789&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3764&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3728&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=388-2161&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=327-1910&m=dev

  3.1a.

- scope: DS Batch 1 (Input-family)
- components: FormInput, FormDropdown, DropdownBox, DropdownMenu, DatePicker, DialcodePicker, LangPicker, LangMenu behavior
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3789&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3764&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3728&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=388-2161&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=405-4532&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=327-1910&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3890&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=343-3881&m=dev
- progress: 8/8

  3.1b.

- scope: DS Batch 2 (to be defined)
- progress: 0/0

  3.1c.

- scope: DS Batch 3 (to be defined)
- progress: 0/0

4.

- route: app/(dashboard)/candidate/jobs
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=283-2635&m=dev
- description: jobs applied by the candidate
- current state: minor design mismatch

5.

- component: Email field, Password field
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=386-3148&m=dev, https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=386-3149&m=dev
- description: login / signup fields
- current state: design mismatch and icon mismatch (hidden password should be paired with hidden.svg, current implementation has flipped icon states)

6.

- route: app/jobs
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15170&m=dev
- description : jobs page
- current state: design mismatch and feature mismatch (where is the apply button??)

7.

- route: app/jobs/[id]
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=330-3286&m=dev
- description : jobs detail
- current state: design mismatch and feature mismatch (withdraw not needed in this page and job description share button missing.)

8.

- route: app/annoucnments
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15060&m=dev
- description: announcements
- current state: design mismatch

8.

- route: app/annoucnments/[id]
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=315-15103&m=dev
- description: announcements detail
- current state: design mismatch

9.

- components : the entire sign in / sign up flow
- design: https://www.figma.com/design/27tn2lCDeji78dNzuOICXv/Vridge-Web-Ver-0.1?node-id=285-14949&m=dev
- current state: highly likely desing mismatch

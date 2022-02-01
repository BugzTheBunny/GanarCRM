-Only Owner can add members
-Assings leads to a member
    - Update lead model
    - Update Serializer
    - Override update function
    - Change the edit lead page
- Show assignee in leads list
- Show assignee in leads detail page


Notes:

- `assigned_to = UserSerializer(read_only=True)`  this makes the field read only, meaning its not a must, meaning you can't create a user when assigning.
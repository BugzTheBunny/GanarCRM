# Implementing Pagination + Search

- Half of this video is pretty much copy paste.

Apperantly adding pagination with Vue is super easy!
Implementing Search is also pretty easy!

----
#### **Pagination (You can do pretty much the same for Clients) :**

#### Backend:
1. import `from rest_framework.pagination import PageNumberPagination`
1. Create `class LeadPagination`
2. add `pagination_class = LeadPagination`
```
from rest_framework.pagination import PageNumberPagination

class LeadPagination(PageNumberPagination):
    page_size = 4


class LeadViewSet(viewsets.ModelViewSet)
    ...
    pagination_class = LeadPagination
```

#### Frontend:
1. Create buttons for next & previous somewhere, with @click event
```
<-- Buttons creation -->
<div class="buttons">
    <button
        class="button is-light"
        v-if="showPreviousButton"
        @click="goToPreviousPage()"
    >
        <strong> Previous </strong>
    </button>
    <button
        class="button is-light"
        v-if="showNextButton"
        @click="goToNextPage()"
    >
        <strong>Next</strong>
    </button>
</div>
```
2. Create 3 new data objects (You understand what they are by name)
```
data(){
    ...
    showNextButton: false,
    showPreviousButton: false,
    currentPage: 1,
}
```
3. Add methods to manipule the page number:
```
goToNextPage() {
      this.currentPage += 1;
      this.getLeads();
    },

goToPreviousPage() {
      this.currentPage -= 1;
      this.getLeads();
    },
```
4. Update the function, and notice the if statments, they are easy to understand:

```
 await axios
        .get(`/api/v1/leads/?page=${this.currentPage}}`)
        .then((response) => {
          this.leads = response.data.results;

          if (response.data.next) {
            this.showNextButton = true;
          } else {
            this.showNextButton = false;
          }

          if (response.data.previous) {
            this.showPreviousButton = true;
          } else {
            this.showPreviousButton = false;
          }
        })
        .catch((error) => {
          console.log(error);
        });

```
---
#### **Search / Filter (You can do pretty much the same for Clients) :**

#### Backend:

1. import filters
2. add filter keywords, and append the functionality
```
from rest_framework import ... ,filters

class LeadViewSet(viewsets.ModelViewSet):
    ...
    filter_backends = (filters.SearchFilter,)
    search_fields = ('company', 'contact_person')

```

#### Frontend:

1. Add the Gui component somewhere:
```
<form @submit.prevent="filterTable">
    <div class="field has-addons">
        <div class="control">
            <input
                class="input"
                type="text"
                placeholder="Lead.."
                v-model="query"
            />
        </div>
        <div class="control">
            <button class="button is-success">Search</button>
        </div>
    </div>
</form>
```
2. add `query:''` to the `data(){}`
3. Create filtering method:
```
filterTable() {
    this.getLeads();
},
```
4. Update axios call (with &search={this.query}):
```
.get(`/api/v1/leads/?page=${this.currentPage}&search=${this.query}`)
```
----

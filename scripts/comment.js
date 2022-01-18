const deleteForm = document.querySelectorAll(".deleteForm");

deleteForm.forEach(form => {
    form.addEventListener("submit", () => {
        form.submit();
        form.remove();
    })
})
document.addEventListener('DOMContentLoaded', () => {
   function initPVBehavior(form) {
    const boxes = Array.from(form.querySelectorAll('input.pv'));

    boxes.forEach((box, idx) => {
        box.addEventListener('click', () => {
            boxes.forEach((b, i) => {
                b.checked = i <= idx;
            });
        });
    });
}

    // init existing forms
    document.querySelectorAll('.form-container').forEach(f => initPVBehavior(f));

    // clone form
    const cloneBtn = document.getElementById('clone-form');
    if (cloneBtn) {
        cloneBtn.addEventListener('click', () => {
            const originals = Array.from(document.querySelectorAll('.form-container'));
            const original = originals[0];
            if (!original) return;

            const clone = original.cloneNode(true);

            // make ids unique in clone
            const suffix = '-copy' + (originals.length + 1);
            clone.querySelectorAll('[id]').forEach(el => {
                const oldId = el.id;
                if (!oldId) return;
                el.id = oldId + suffix;
            });

            // update labels 'for'
            clone.querySelectorAll('label[for]').forEach(lbl => {
                const oldFor = lbl.getAttribute('for');
                if (!oldFor) return;
                lbl.setAttribute('for', oldFor + suffix);
            });

            // clear checkbox states and other inputs
            clone.querySelectorAll('input').forEach(inp => {
                if (inp.type === 'checkbox' || inp.type === 'radio') inp.checked = false;
                else inp.value = '';
            });
            clone.querySelectorAll('textarea').forEach(t => t.value = '');

            // append after the last form
            const lastForm = originals[originals.length - 1];
            lastForm.after(clone);

            // init behavior on clone
            initPVBehavior(clone);
        });
    }

    // delete form
    const deleteBtn = document.getElementById('delete-form');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const forms = Array.from(document.querySelectorAll('.form-container'));
            if (forms.length > 1) {
                forms[forms.length - 1].remove();
            } else if (forms.length === 1) {
                const form = forms[0];
                form.querySelectorAll('input').forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
                    else input.value = '';
                });
                form.querySelectorAll('textarea').forEach(t => t.value = '');
                form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
            }
        });
    }
});
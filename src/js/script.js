document.addEventListener('DOMContentLoaded', () => {
    const cloneBtn = document.getElementById('clone-form');

    function initPVBehavior(form) {
        const boxes = Array.from(form.querySelectorAll('input.pv'));
        if (!boxes.length) return;

        function updateUpTo(index) {
            boxes.forEach((b, i) => b.checked = i <= index);
        }

        boxes.forEach((box, idx) => {
            // remove listeners guard (in case re-initialized) by cloning node
            box.replaceWith(box.cloneNode(true));
        });

        const freshBoxes = Array.from(form.querySelectorAll('input.pv'));

        freshBoxes.forEach((box, idx) => {
            box.addEventListener('click', (e) => {
                e.preventDefault(); // control manual checking
                const current = freshBoxes.map(b => b.checked);
                const lastChecked = current.lastIndexOf(true);
                if (current[idx] && lastChecked === idx) {
                    // if clicked the last checked, clear all
                    freshBoxes.forEach(b => b.checked = false);
                } else {
                    updateUpTo(idx);
                }
            });

            box.addEventListener('keydown', (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    updateUpTo(idx);
                }
            });
        });
    }

    // initialize existing forms
    document.querySelectorAll('.form-container').forEach(form => initPVBehavior(form));

    cloneBtn.addEventListener('click', () => {
        const original = document.querySelector('.form-container');
        if (!original) return;

        const clone = original.cloneNode(true);

        // make ids unique in clone and reset checkbox states
        const suffix = '-copy' + (document.querySelectorAll('.form-container').length + 1);
        clone.querySelectorAll('[id]').forEach(el => {
            const oldId = el.id;
            if (!oldId) return;
            const newId = oldId + suffix;
            el.id = newId;
        });

        // update label 'for' attributes inside clone
        clone.querySelectorAll('label[for]').forEach(lbl => {
            const oldFor = lbl.getAttribute('for');
            if (!oldFor) return;
            lbl.setAttribute('for', oldFor + suffix);
        });

        // clear checkbox states
        clone.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

        // append clone after the last form
        original.parentNode.insertBefore(clone, original.nextSibling);

        // initialize behavior on the new clone
        initPVBehavior(clone);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const deleteBtn = document.getElementById('delete-form');
    if (!deleteBtn) return;

    deleteBtn.addEventListener('click', () => {
        const forms = Array.from(document.querySelectorAll('.form-container'));
        if (forms.length > 1) {
            // remove o último formulário da página
            const last = forms[forms.length - 1];
            last.remove();
        } else if (forms.length === 1) {
            // se for o único formulário, apenas limpa os campos
            const form = forms[0];
            form.querySelectorAll('input').forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') input.checked = false;
                else input.value = '';
            });
            form.querySelectorAll('textarea').forEach(t => t.value = '');
            form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
        }
    });
});
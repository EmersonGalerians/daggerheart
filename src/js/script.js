document.addEventListener('DOMContentLoaded', () => {
    function initPVBehavior(form) {
        const boxes = Array.from(form.querySelectorAll('input.pv'));

        boxes.forEach((box, idx) => {
            box.addEventListener('pointerdown', (e) => {
                e.preventDefault();

                const lastChecked =
                    boxes.findLastIndex(b => b.checked);

                // se clicou no último ativo -> remove um
                if (idx === lastChecked) {

                    boxes.forEach((b, i) => {
                        b.checked = i < idx;
                    });

                } else {

                    // adiciona até o clicado
                    boxes.forEach((b, i) => {
                        b.checked = i <= idx;
                    });
                }

                saveForms();
            });
        });
    }
    function initStressBehavior(form) {
        const boxes = Array.from(form.querySelectorAll('input.stress'));

        boxes.forEach((box, idx) => {
            box.addEventListener('click', () => {
                boxes.forEach((b, i) => {
                    b.checked = i <= idx;
                });
            });
        });
    }

    // init existing forms
    document.querySelectorAll('.form-container').forEach(f => {
        initPVBehavior(f);
        initStressBehavior(f);
    });

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
            initStressBehavior(clone);
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

document.addEventListener('DOMContentLoaded', () => {
    // ...existing code (initPVBehavior, clone/delete handlers) ...

    // tema: persistir em localStorage e alternar classe 'dark' no body
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const saved = localStorage.getItem('dh-theme');
    if (saved === 'dark') {
        body.classList.add('dark');
        if (themeBtn) themeBtn.textContent = 'Tema: Claro';
        if (themeBtn) themeBtn.setAttribute('aria-pressed', 'true');
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark');
            localStorage.setItem('dh-theme', isDark ? 'dark' : 'light');
            themeBtn.textContent = isDark ? 'Tema: Claro' : 'Tema: Escuro';
            themeBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        });
    }
});
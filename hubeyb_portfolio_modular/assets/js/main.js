const projectContent = {
    tripfulSite: {number:'PROJECT 01 / TRAVEL',title:'Tripful Travel Agency Website',description:'A collaborative travel agency website for exploring flights, hotels, holiday packages, and car rentals. The repository describes destination pages with descriptions, images, and attractions, together with customer reviews and feedback for hotels and packages.',status:'TEAM PROJECT',tags:['Travel platform','Destination search','Flights & hotels','Reviews & feedback'],note:'COLLABORATIVE PROJECT · MENA-M16',url:'https://github.com/Mena-M16/Tripful-Travel-Agency-Website'},
    tripfulBooking: {number:'PROJECT 02 / FULL STACK',title:'Tripful Travel Booking Website',description:'A full-stack travel booking platform where customers can browse and filter holiday packages, make bookings, and track payment status, including a Book Now, Pay Later option. Staff can manage packages, availability, and customer bookings through an admin dashboard.',status:'TEAM PROJECT',tags:['React 19','Node.js','Express 5','PostgreSQL','JWT'],note:'COLLABORATIVE PROJECT · MURADBZUNEH',url:'https://github.com/muradbzuneh/Tripful-travel-agency'},
    inventory: {number:'PROJECT 03 / DESKTOP & DATABASE',title:'Inventory Management System',description:'A Java desktop application for small and medium-sized businesses. The repository describes product and supplier management, stock movement tracking, low-stock alerts, transaction history, dashboard analytics, and report exports.',status:'TEAM PROJECT',tags:['Java Swing','MySQL','Inventory tracking','Reports & analytics'],note:'COLLABORATIVE PROJECT · MENA-M16',url:'https://github.com/Mena-M16/Inventory-Management-System'},
    student: {number:'PROJECT 04 / FULL STACK',title:'Wollo University Student Management System',description:'A full-stack university management system with separate admin, teacher, and student workflows. Features include managing students, teachers, subjects, classes, attendance, grades, announcements, and course registration.',status:'TEAM PROJECT',tags:['Django','React','PostgreSQL','University management'],note:'COLLABORATIVE PROJECT · MAHLET-CH',url:'https://github.com/Mahlet-Ch/Student-Management-System'},
    portfolio: {number:'PROJECT 05 / WEB',title:'Personal Developer Portfolio',description:'A responsive personal website presenting a developer profile, technical toolkit, academic background, and contact information. It includes dark and light themes, interactive skill and project panels, mobile navigation, and a 3D visual element.',status:'PERSONAL BUILD',tags:['HTML','CSS','JavaScript','Three.js'],note:'PERSONAL WEBSITE · RESPONSIVE BUILD',url:'https://github.com/hhubi3262-hub'}
  };
  const projectButtons = document.querySelectorAll('.project-choice');
  const projectPanel = document.getElementById('project-detail');
  projectButtons.forEach(button => button.addEventListener('click', () => {
    const item = projectContent[button.dataset.project];
    if (!item) return;
    projectButtons.forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });
    projectPanel.style.animation = 'none';
    void projectPanel.offsetWidth;
    projectPanel.style.animation = '';
    projectPanel.setAttribute('aria-labelledby', button.id);
    document.getElementById('project-number').textContent = item.number;
    document.querySelector('.project-status').textContent = item.status;
    document.getElementById('project-title').textContent = item.title;
    document.getElementById('project-description').textContent = item.description;
    document.getElementById('project-note').textContent = item.note;
    const projectLink = document.getElementById('project-link');
    projectLink.href = item.url;
    projectLink.style.display = item.url ? 'inline-flex' : 'none';
    document.getElementById('project-tags').replaceChildren(...item.tags.map(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      return span;
    }));
  }));
  projectButtons.forEach((button, index) => button.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const next = (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + projectButtons.length) % projectButtons.length;
    projectButtons[next].focus();
    projectButtons[next].click();
  }));

  // Public GitHub profile integration: new public repositories appear automatically.
  (async function loadGitHubProjects(){
    const username = 'hhubi3262-hub';
    const list = document.querySelector('.project-list');
    const status = document.getElementById('github-sync-status');
    const profileUrl = `https://github.com/${username}`;
    const featuredUrls = new Set(Object.values(projectContent).map(p => p.url.replace(/\.git$/, '').toLowerCase()));
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`, {
        headers: { 'Accept': 'application/vnd.github+json' }
      });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const repos = await response.json();
      const additional = repos.filter(repo => !featuredUrls.has(repo.html_url.replace(/\.git$/, '').toLowerCase()));
      additional.forEach((repo, index) => {
        const key = `github-${repo.id}`;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'project-choice';
        button.id = `project-tab-${key}`;
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('aria-controls', 'project-detail');
        const symbol = (repo.name || 'GH').replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase() || 'GH';
        button.innerHTML = `<span class="project-choice-art"><span>${symbol}</span></span><span class="project-choice-copy"><small>GITHUB · AUTO-ADDED</small><b></b><span></span></span><span class="project-choice-arrow">↗</span>`;
        button.querySelector('b').textContent = repo.name.replace(/[-_]/g, ' ');
        button.querySelector('.project-choice-copy > span').textContent = repo.language || 'GitHub repository';
        button.addEventListener('click', () => {
          list.querySelectorAll('.project-choice').forEach(tab => {
            const selected = tab === button;
            tab.classList.toggle('active', selected);
            tab.setAttribute('aria-selected', String(selected));
            tab.setAttribute('tabindex', selected ? '0' : '-1');
          });
          projectPanel.style.animation = 'none'; void projectPanel.offsetWidth; projectPanel.style.animation = '';
          projectPanel.setAttribute('aria-labelledby', button.id);
          document.getElementById('project-number').textContent = `GITHUB REPOSITORY / ${String(index + 1).padStart(2, '0')}`;
          document.querySelector('.project-status').textContent = repo.private ? 'PRIVATE' : 'PUBLIC REPOSITORY';
          document.getElementById('project-title').textContent = repo.name.replace(/[-_]/g, ' ');
          document.getElementById('project-description').textContent = repo.description || 'A public repository from my GitHub profile. Open the repository to explore its source code, README, and development history.';
          document.getElementById('project-note').textContent = `UPDATED ${new Date(repo.updated_at).toLocaleDateString()} · ${repo.stargazers_count} STARS`;
          const link = document.getElementById('project-link'); link.href = repo.html_url; link.style.display = 'inline-flex';
          const values = [repo.language, ...(repo.topics || []).slice(0, 5), `★ ${repo.stargazers_count} stars`].filter(Boolean);
          document.getElementById('project-tags').replaceChildren(...values.map(value => { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = value; return tag; }));
        });
        list.appendChild(button);
      });
      status.textContent = additional.length
        ? `✓ Connected to ${username} · ${additional.length} additional public ${additional.length === 1 ? 'repository' : 'repositories'} loaded automatically. New public repositories will appear here when this page is opened.`
        : `✓ Connected to ${username} · Your featured projects are shown above. No additional public repositories found.`;
    } catch (error) {
      console.warn('GitHub repository sync unavailable:', error);
      status.textContent = `GitHub auto-sync is temporarily unavailable. Your featured project links still work. View all repositories at ${profileUrl}.`;
    }
  })();

  const skillContent = {
    programming: {number:'CATEGORY 01',title:'Programming Languages',mark:'</>',description:'Core programming languages for learning problem-solving and software development.',tags:['Java','JavaScript','Python','PHP','C++']},
    frontend: {number:'CATEGORY 02',title:'Frontend Development',mark:'UI',description:'Building the structure, visual design, and interactive parts of responsive web experiences.',tags:['HTML','CSS','Bootstrap','React']},
    backend: {number:'CATEGORY 03',title:'Backend Development',mark:'API',description:'Learning server-side development, application logic, and the systems that support web applications.',tags:['Node.js','PHP']},
    database: {number:'CATEGORY 04',title:'Database Management',mark:'DB',description:'Learning how applications store, organize, design, and retrieve information.',tags:['SQL','Database concepts','Database design']},
    software: {number:'CATEGORY 05',title:'Software Development',mark:'DEV',description:'Applying programming fundamentals and problem-solving to plan and build practical software solutions.',tags:['Problem solving','Programming','Application development']},
    learning: {number:'CATEGORY 06',title:'Continuous Learning',mark:'∞',description:'Exploring new tools, strengthening technical foundations, and improving through hands-on practice and experimentation.',tags:['Practice','Experimentation','Learning by building']}
  };
  const skillButtons = document.querySelectorAll('.skill-option');
  const skillPanel = document.getElementById('skill-detail');
  skillButtons.forEach(button => button.addEventListener('click', () => {
    const item = skillContent[button.dataset.skill];
    if (!item) return;
    skillButtons.forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.setAttribute('tabindex', selected ? '0' : '-1');
    });
    skillPanel.style.animation = 'none';
    void skillPanel.offsetWidth;
    skillPanel.style.animation = '';
    skillPanel.setAttribute('aria-labelledby', button.id);
    document.getElementById('skill-number').textContent = item.number;
    document.getElementById('skill-title').textContent = item.title;
    document.getElementById('skill-mark').textContent = item.mark;
    document.getElementById('skill-description').textContent = item.description;
    document.getElementById('skill-tags').replaceChildren(...item.tags.map(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      return span;
    }));
  }));
  skillButtons.forEach((button, index) => button.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(event.key)) return;
    event.preventDefault();
    const next = (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + skillButtons.length) % skillButtons.length;
    skillButtons[next].focus();
    skillButtons[next].click();
  }));

  const header=document.getElementById('header');
  addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>20));
  document.getElementById('year').textContent=new Date().getFullYear();
  document.getElementById('themeToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('hubeyb-theme',document.body.classList.contains('light')?'light':'dark')});
  if(localStorage.getItem('hubeyb-theme')==='light')document.body.classList.add('light');
  const menu=document.getElementById('navlinks');
  document.getElementById('menuBtn').addEventListener('click',()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  document.getElementById('contactForm').addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('senderName').value;
    const email=document.getElementById('senderEmail').value;
    const msg=document.getElementById('senderMessage').value;
    const subject=encodeURIComponent('Portfolio contact from '+name);
    const body=encodeURIComponent(msg+'\n\nFrom: '+name+' ('+email+')');
    window.location.href='mailto:h.hubi.3262@gmail.com?subject='+subject+'&body='+body;
  });
